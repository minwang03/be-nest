import { IpProxy } from '@/modules/ip-proxy/schemas/ip-proxy.schema';
import { Order } from '@/modules/order/schemas/order.schema';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type OrderDetailDocument = HydratedDocument<OrderDetail>;

@Schema({ timestamps: true })
export class OrderDetail {
  @Prop({ type: Types.ObjectId, ref: Order.name })
  order: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: IpProxy.name })
  ipProxy: Types.ObjectId;

  @Prop()
  protocol: string;

  @Prop()
  autochangeIP: boolean;

  @Prop()
  proxysecurity: string;

  @Prop()
  allowedIP?: string;

  @Prop()
  allowedUser?: string;

  @Prop()
  allowedPass?: string;

  @Prop()
  autoextent: boolean;

  @Prop()
  note?: string;

  @Prop()
  cost: number;

  @Prop()
  sumcost: number;
}

export const OrderDetailSchema = SchemaFactory.createForClass(OrderDetail);
