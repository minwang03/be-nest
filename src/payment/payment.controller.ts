import {
  Controller,
  Get,
  Post,
  Query,
  Body,
  UseGuards,
  Req,
} from '@nestjs/common';
import { PaymentService } from './payment.service';
import { JwtAuthGuard } from '@/auth/passport/jwt-auth.guard';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @UseGuards(JwtAuthGuard)
  @Post('create')
  async createPayment(@Req() req: any, @Body() body: { amount: number }) {
    const { amount } = body;
    const userId = req.user.sub;

    const orderId = await this.paymentService.create(amount, userId);

    const clientIp =
      (req.headers['x-forwarded-for']?.split(',')[0] ||
        req.socket.remoteAddress ||
        '')?.trim();

    const paymentUrl = await this.paymentService.createPaymentUrl(
      orderId,
      amount,
      clientIp,
    );

    return { paymentUrl };
  }

  @Get('callback')
  async paymentCallback(@Query() query: any) {
    const result = await this.paymentService.handleCallback(query);
    return { message: 'Payment processed', data: result };
  }

  @UseGuards(JwtAuthGuard)
  @Get('status')
  async getStatus(@Req() req: any, @Query('orderId') orderId: string) {
    const userId = req.user.sub;
    return this.paymentService.findOne(orderId, userId);
  }
}
