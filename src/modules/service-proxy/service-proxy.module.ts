import { Module } from '@nestjs/common';
import { ServiceProxyService } from '@/modules/service-proxy/service-proxy.service';
import { ServiceProxyController } from '@/modules/service-proxy/service-proxy.controller';
import {
  ServiceProxy,
  ServiceProxySchema,
} from '@/modules/service-proxy/schemas/service-proxy.schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ServiceProxy.name, schema: ServiceProxySchema },
    ]),
  ],
  controllers: [ServiceProxyController],
  providers: [ServiceProxyService],
})
export class ServiceProxyModule {}
