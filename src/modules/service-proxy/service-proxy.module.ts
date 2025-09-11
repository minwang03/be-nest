import { Module } from '@nestjs/common';
import { ServiceProxyService } from './service-proxy.service';
import { ServiceProxyController } from './service-proxy.controller';

@Module({
  controllers: [ServiceProxyController],
  providers: [ServiceProxyService],
})
export class ServiceProxyModule {}
