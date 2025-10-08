import { Injectable, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Payment, PaymentDocument } from './schemas/payment.schema';
import axios from 'axios';
import * as crypto from 'crypto';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class PaymentService {
  constructor(
    @InjectModel(Payment.name) private paymentModel: Model<PaymentDocument>,
  ) {}

  async create(amount: number, userId: string) {
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

  async createPaymentUrl(orderId: string, amount: number, ipAddr: string) {
    const partnerCode = process.env.MOMO_PARTNER_CODE;
    const accessKey = process.env.MOMO_ACCESS_KEY;
    const secretKey = process.env.MOMO_SECRET_KEY as string;
    const redirectUrl = process.env.MOMO_REDIRECT_URL;
    const ipnUrl = process.env.MOMO_IPN_URL;
    const momoAPI = process.env.MOMO_API as string;
    const requestId = uuidv4();

    const rawSignature = `accessKey=${accessKey}&amount=${amount}&extraData=&ipnUrl=${ipnUrl}&orderId=${orderId}&orderInfo=Nap tien tai khoan&partnerCode=${partnerCode}&redirectUrl=${redirectUrl}&requestId=${requestId}&requestType=captureWallet`;

    const signature = crypto
      .createHmac('sha256', secretKey)
      .update(rawSignature)
      .digest('hex');

    const body = {
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

    const res = await axios.post(momoAPI, body, {
      headers: { 'Content-Type': 'application/json' },
    });

    return res.data.payUrl;
  }

  async handleCallback(query: any) {
    const { orderId, resultCode } = query;

    const status = resultCode === '0' ? 'paid' : 'failed';

    const updated = await this.paymentModel.findOneAndUpdate(
      { orderId },
      { status, paidAt: new Date() },
      { new: true },
    );

    return updated;
  }

  async findOne(orderId: string, userId: string) {
    const payment = await this.paymentModel.findOne({ orderId });

    if (!payment) {
      throw new ForbiddenException('Không tìm thấy giao dịch này.');
    }

    if (payment.user.toString() !== userId) {
      throw new ForbiddenException('Bạn không có quyền xem giao dịch này.');
    }

    return payment;
  }
}
