import { Injectable, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Payment, PaymentDocument } from './schemas/payment.schema';
import { User, UserDocument } from '@/modules/users/schemas/user.schema';
import axios from 'axios';
import * as crypto from 'crypto';
import { v4 as uuidv4 } from 'uuid';

interface MoMoConfig {
  partnerCode: string;
  accessKey: string;
  secretKey: string;
  redirectUrl: string;
  ipnUrl: string;
  apiUrl: string;
}

interface MoMoCallbackData {
  orderId: string;
  resultCode: string;
  signature: string;
  amount: number;
  extraData: string;
  message: string;
  orderInfo: string;
  orderType: string;
  partnerCode: string;
  payType: string;
  requestId: string;
  responseTime: string;
  transId: string;
}

@Injectable()
export class PaymentService {
  private readonly momoConfig: MoMoConfig;

  constructor(
    @InjectModel(Payment.name) private paymentModel: Model<PaymentDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {
    this.momoConfig = this.initializeMoMoConfig();
  }

  // Khởi tạo cấu hình MoMo từ environment variables
  private initializeMoMoConfig(): MoMoConfig {
    return {
      partnerCode: process.env.MOMO_PARTNER_CODE!,
      accessKey: process.env.MOMO_ACCESS_KEY!,
      secretKey: process.env.MOMO_SECRET_KEY!,
      redirectUrl: process.env.MOMO_REDIRECT_URL!,
      ipnUrl: process.env.MOMO_IPN_URL!,
      apiUrl: process.env.MOMO_API!,
    };
  }

  // Tạo payment record mới trong database
  async create(amount: number, userId: string): Promise<string> {
    const orderId = uuidv4();

    const payment = new this.paymentModel({
      orderId,
      amount,
      user: new Types.ObjectId(userId),
      status: 'pending',
    });

    await payment.save();

    return orderId;
  }

  // Tạo URL thanh toán MoMo
  async createPaymentUrl(
    orderId: string,
    amount: number,
    ipAddr: string,
  ): Promise<string> {
    const requestId = uuidv4();
    const signature = this.generatePaymentSignature(orderId, amount, requestId);

    const requestBody = this.buildPaymentRequestBody(
      orderId,
      amount,
      requestId,
      signature,
    );

    const response = await this.sendPaymentRequest(requestBody);

    return response.data.payUrl;
  }

  // Tạo chữ ký cho yêu cầu thanh toán
  private generatePaymentSignature(
    orderId: string,
    amount: number,
    requestId: string,
  ): string {
    const { accessKey, secretKey, partnerCode, redirectUrl, ipnUrl } =
      this.momoConfig;

    const rawSignature = [
      `accessKey=${accessKey}`,
      `amount=${amount}`,
      `extraData=`,
      `ipnUrl=${ipnUrl}`,
      `orderId=${orderId}`,
      `orderInfo=Nap tien tai khoan`,
      `partnerCode=${partnerCode}`,
      `redirectUrl=${redirectUrl}`,
      `requestId=${requestId}`,
      `requestType=captureWallet`,
    ].join('&');

    return crypto
      .createHmac('sha256', secretKey)
      .update(rawSignature)
      .digest('hex');
  }

  // Xây dựng request body cho MoMo API
  private buildPaymentRequestBody(
    orderId: string,
    amount: number,
    requestId: string,
    signature: string,
  ) {
    const { partnerCode, accessKey, redirectUrl, ipnUrl } = this.momoConfig;

    return {
      partnerCode,
      accessKey,
      requestId,
      amount,
      orderId,
      orderInfo: 'Nap tien tai khoan',
      redirectUrl,
      ipnUrl,
      requestType: 'captureWallet',
      extraData: '',
      signature,
      lang: 'vi',
    };
  }

  // Gửi request đến MoMo API
  private async sendPaymentRequest(body: any) {
    return await axios.post(this.momoConfig.apiUrl, body, {
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // Xử lý callback từ MoMo sau khi thanh toán
  async handleCallback(data: MoMoCallbackData): Promise<{ message: string }> {
    try {
      this.validateCallbackSignature(data);

      const payment = await this.findPayment(data.orderId);
      if (!payment) {
        return { message: 'Order not found' };
      }

      const paymentStatus = this.determinePaymentStatus(data.resultCode);

      await this.processPayment(payment, paymentStatus);

      return { message: 'Success' };
    } catch (err) {
      console.error('[Payment Callback Error]', err);
      throw err;
    }
  }

  // Xác thực chữ ký từ MoMo callback
  private validateCallbackSignature(data: MoMoCallbackData): void {
    const {
      orderId,
      resultCode,
      signature,
      amount,
      extraData,
      message,
      orderInfo,
      orderType,
      partnerCode,
      payType,
      requestId,
      responseTime,
      transId,
    } = data;

    const rawSignature = [
      `accessKey=${this.momoConfig.accessKey}`,
      `amount=${amount}`,
      `extraData=${extraData}`,
      `message=${message}`,
      `orderId=${orderId}`,
      `orderInfo=${orderInfo}`,
      `orderType=${orderType}`,
      `partnerCode=${partnerCode}`,
      `payType=${payType}`,
      `requestId=${requestId}`,
      `responseTime=${responseTime}`,
      `resultCode=${resultCode}`,
      `transId=${transId}`,
    ].join('&');

    const calculatedSignature = crypto
      .createHmac('sha256', this.momoConfig.secretKey)
      .update(rawSignature)
      .digest('hex');

    if (calculatedSignature !== signature) {
      throw new ForbiddenException('Invalid signature from MoMo');
    }
  }

  // Tìm payment trong database
  private async findPayment(orderId: string): Promise<PaymentDocument | null> {
    return await this.paymentModel.findOne({ orderId });
  }

  // Xác định trạng thái thanh toán
  private determinePaymentStatus(resultCode: string): 'paid' | 'failed' {
    return Number(resultCode) === 0 ? 'paid' : 'failed';
  }

  // Xử lý payment: cập nhật balance và status
  private async processPayment(
    payment: PaymentDocument,
    status: 'paid' | 'failed',
  ): Promise<void> {
    if (status === 'paid' && payment.status !== 'paid') {
      await this.updateUserBalance(payment.user, payment.amount);
    }

    payment.status = status;
    if (status === 'paid') {
      payment.paidAt = new Date();
    }

    await payment.save();
  }

  // Cập nhật balance của user
  private async updateUserBalance(
    userId: Types.ObjectId,
    amount: number,
  ): Promise<void> {
    await this.userModel.findByIdAndUpdate(userId, {
      $inc: { balance: amount },
    });
  }

  //Lấy lịch sử thanh toán của user
  async getHistory(userId: string) {
    return await this.paymentModel
      .find({ user: new Types.ObjectId(userId) })
      .sort({ createdAt: -1 })
      .select('orderId amount status createdAt paidAt')
      .lean();
  }
}
