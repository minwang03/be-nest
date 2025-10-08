import {
  Controller,
  Get,
  Post,
  Query,
  Body,
  UseGuards,
  Req,
  Res,
} from '@nestjs/common';
import { PaymentService } from './payment.service';
import { JwtAuthGuard } from '@/auth/passport/jwt-auth.guard';
import type { Response as ExpressResponse } from 'express';
import { Public } from '@/decorator/customize';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @UseGuards(JwtAuthGuard)
  @Post('create')
  async createPayment(@Req() req: any, @Body() body: { amount: number }) {
    const { amount } = body;
    const userId = req.user.sub;
    const orderId = await this.paymentService.create(amount, userId);
    const clientIp = (
      req.headers['x-forwarded-for']?.split(',')[0] ||
      req.socket.remoteAddress ||
      ''
    )?.trim();
    const paymentUrl = await this.paymentService.createPaymentUrl(
      orderId,
      amount,
      clientIp,
    );
    return { paymentUrl };
  }

  @Public()
  @Get('callback')
  async momoCallbackGet(@Query() query: any) {
    await this.paymentService.handleCallback(query);
    return {
      redirectUrl: 'http://localhost:3000/dashboard',
    };
  }

  @Public()
  @Post('ipn')
  async momoIpn(@Body() body: any) {
    return await this.paymentService.handleCallback(body);
  }
}
