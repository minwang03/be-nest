import { Injectable, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Payment, PaymentDocument } from './schemas/payment.schema';
import axios from 'axios';
import * as crypto from 'crypto';
import { v4 as uuidv4 } from 'uuid';
import { User, UserDocument } from '@/modules/users/schemas/user.schema';

@Injectable()
export class PaymentService {
  constructor(
    @InjectModel(Payment.name) private paymentModel: Model<PaymentDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
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
    const secretKey = process.env.MOMO_SECRET_KEY!;
    const redirectUrl = process.env.MOMO_REDIRECT_URL;
    const ipnUrl = process.env.MOMO_IPN_URL;
    const momoAPI = process.env.MOMO_API!;
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

  async handleCallback(data: any) {
    try {
      const { orderId, resultCode, signature, ...rest } = data;

      const rawSignature = `accessKey=${process.env.MOMO_ACCESS_KEY}&amount=${rest.amount}&extraData=${rest.extraData}&message=${rest.message}&orderId=${orderId}&orderInfo=${rest.orderInfo}&orderType=${rest.orderType}&partnerCode=${rest.partnerCode}&payType=${rest.payType}&requestId=${rest.requestId}&responseTime=${rest.responseTime}&resultCode=${resultCode}&transId=${rest.transId}`;

      const checkSignature = crypto
        .createHmac('sha256', process.env.MOMO_SECRET_KEY!)
        .update(rawSignature)
        .digest('hex');

      if (checkSignature !== signature) {
        throw new ForbiddenException('Invalid signature from MoMo');
      }

      const status = Number(resultCode) === 0 ? 'paid' : 'failed';

      const payment = await this.paymentModel.findOneAndUpdate(
        { orderId },
        { status, paidAt: new Date() },
        { new: true },
      );

      if (!payment) {
        return { message: 'Order not found' };
      }

      if (status === 'paid') {
        await this.userModel.findByIdAndUpdate(payment.user, {
          $inc: { balance: payment.amount },
        });
      }
      return { message: 'Success' };
    } catch (err) {
      throw err;
    }
  }
}
