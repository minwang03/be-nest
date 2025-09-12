import { Module } from '@nestjs/common';
import { ServiceProxyService } from './service-proxy.service';
import { ServiceProxyController } from './service-proxy.controller';
import {
  ServiceProxy,
  ServiceProxySchema,
} from './schemas/service-proxy.schema';
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
