import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProxyStatusService } from './proxy-status.service';
import { ProxyStatusController } from './proxy-status.controller';
import {
  PackageProxy,
  PackageProxySchema,
} from '@/modules/package-proxy/schemas/package-proxy.schema';
import { Location, LocationSchema } from '@/modules/location/schemas/location.schema';
import { User, UserSchema } from '../users/schemas/user.schema';
import { Order, OrderSchema } from '../order/schemas/order.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: PackageProxy.name, schema: PackageProxySchema },
      { name: Location.name, schema: LocationSchema },
      { name: User.name, schema: UserSchema },
      { name: Order.name, schema: OrderSchema },
    ]),
  ],
  controllers: [ProxyStatusController],
  providers: [ProxyStatusService],
})
export class ProxyStatusModule {}
