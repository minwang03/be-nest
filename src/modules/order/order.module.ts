import { Module } from '@nestjs/common';
import { OrderService } from '@/modules/order/order.service';
import { OrderController } from '@/modules/order/order.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Order, OrderSchema } from '@/modules/order/schemas/order.schema';
import { OrderDetail, OrderDetailSchema } from '../order-detail/schemas/order-detail.schema';
import { IpProxy, IpProxySchema } from '../ip-proxy/schemas/ip-proxy.schema';
import { PackageProxy, PackageProxySchema } from '../package-proxy/schemas/package-proxy.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Order.name, schema: OrderSchema },
      { name: OrderDetail.name, schema: OrderDetailSchema },
      { name: IpProxy.name, schema: IpProxySchema },
      { name: PackageProxy.name, schema: PackageProxySchema },
    ]),
  ],
  controllers: [OrderController],
  providers: [OrderService],
})
export class OrderModule {}
