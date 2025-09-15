import { Module } from '@nestjs/common';
import { OrderService } from '@/modules/order/order.service';
import { OrderController } from '@/modules/order/order.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Order, OrderSchema } from '@/modules/order/schemas/order.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Order.name, schema: OrderSchema }]),
  ],
  controllers: [OrderController],
  providers: [OrderService],
})
export class OrderModule {}
