import { ServiceProxy } from '@/modules/service-proxy/schemas/service-proxy.schema';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type PackageProxyDocument = HydratedDocument<PackageProxy>;

@Schema({ timestamps: true })
export class PackageProxy {
  @Prop()
  name: string;

  @Prop()
  expiry: Date;

  @Prop()
  cost: number;

  @Prop({ type: Types.ObjectId, ref: ServiceProxy.name })
  serviceProxy: Types.ObjectId;
}

export const PackageProxySchema = SchemaFactory.createForClass(PackageProxy);
