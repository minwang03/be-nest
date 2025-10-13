import { PackageProxy } from '@/modules/package-proxy/schemas/package-proxy.schema';
import { User } from '@/modules/users/schemas/user.schema';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { CreateOrderDetailDto } from '@/modules/order-detail/dto/create-order-detail.dto';
import { Location } from '@/modules/location/schemas/location.schema';

export type OrderDocument = HydratedDocument<Order>;

@Schema({ timestamps: true })
export class Order {
  @Prop()
  quantity: number;

  @Prop()
  sumcost: number;

  @Prop({
    type: String,
    enum: ['pending', 'paid', 'active', 'cancelled'],
    default: 'pending',
  })
  status: string;

  @Prop()
  paidAt?: Date;

  @Prop({ type: Types.ObjectId, ref: User.name })
  user: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: PackageProxy.name })
  packageProxy: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: Location.name })
  location: Types.ObjectId;

  @Prop({ type: Object })
  detailTemplate: CreateOrderDetailDto;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
