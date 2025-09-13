import { Module } from '@nestjs/common';
import { IpProxyService } from '@/modules/ip-proxy/ip-proxy.service';
import { IpProxyController } from '@/modules/ip-proxy/ip-proxy.controller';
import { IpProxy, IpProxySchema } from './schemas/ip-proxy.schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: IpProxy.name, schema: IpProxySchema }]),
  ],
  controllers: [IpProxyController],
  providers: [IpProxyService],
})
export class IpProxyModule {}
