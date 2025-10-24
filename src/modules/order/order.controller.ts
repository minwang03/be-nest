import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto, OrderStatus } from './dto/create-order.dto';
import { Public } from '@/decorator/customize';
import { JwtAuthGuard } from '@/auth/passport/jwt-auth.guard';

@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Public()
  @Get()
  findAll() {
    return this.orderService.findAll();
  }

  @Public()
  @Get('user/:userId')
  async findByUserId(@Param('userId') userId: string) {
    return this.orderService.findByUserId(userId);
  }
  
  @UseGuards(JwtAuthGuard)
  @Get('user')
  async findOrdersWithDetails(@Req() req: any) {
    const userId = req.user.sub;
    return this.orderService.findOrdersWithDetails(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() createOrderDto: CreateOrderDto, @Req() req: any) {
    const userId = req.user.sub;
    return this.orderService.create(userId, createOrderDto);
  }

  @Public()
  @Patch(':id/status')
  async updateStatus(
    @Param('id') id: string,
    @Body('status') status: OrderStatus,
  ) {
    return this.orderService.updateStatus(id, status);
  }
}
