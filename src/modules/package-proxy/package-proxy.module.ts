import { Module } from '@nestjs/common';
import { PackageProxyService } from '@/modules/package-proxy/package-proxy.service';
import { PackageProxyController } from '@/modules/package-proxy/package-proxy.controller';
import {
  PackageProxy,
  PackageProxySchema,
} from './schemas/package-proxy.schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: PackageProxy.name, schema: PackageProxySchema },
    ]),
  ],
  controllers: [PackageProxyController],
  providers: [PackageProxyService],
})
export class PackageProxyModule {}
