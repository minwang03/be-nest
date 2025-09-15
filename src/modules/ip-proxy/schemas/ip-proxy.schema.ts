import { PackageProxy } from '@/modules/package-proxy/schemas/package-proxy.schema';
import { ProxyList } from '@/modules/proxy-list/schemas/proxy-list.schema';
import { Location } from '@/modules/location/schemas/location.schema';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type IpProxyDocument = HydratedDocument<IpProxy>;

@Schema({ timestamps: true })
export class IpProxy {
  @Prop()
  address: string;

  @Prop()
  port: number;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ type: Types.ObjectId, ref: PackageProxy.name })
  packageProxy: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: ProxyList.name })
  proxyList: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: Location.name })
  location: Types.ObjectId;
}

export const IpProxySchema = SchemaFactory.createForClass(IpProxy);
