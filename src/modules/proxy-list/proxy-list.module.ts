import { Module } from '@nestjs/common';
import { ProxyListService } from '@/modules/proxy-list/proxy-list.service';
import { ProxyListController } from '@/modules/proxy-list/proxy-list.controller';
import {
  ProxyList,
  ProxyListSchema,
} from '@/modules/proxy-list/schemas/proxy-list.schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ProxyList.name, schema: ProxyListSchema },
    ]),
  ],
  controllers: [ProxyListController],
  providers: [ProxyListService],
})
export class ProxyListModule {}
