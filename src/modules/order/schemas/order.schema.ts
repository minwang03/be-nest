import { PackageProxy } from '@/modules/package-proxy/schemas/package-proxy.schema';
import { User } from '@/modules/users/schemas/user.schema';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { OrderDetailTemplateDto } from '../dto/create-order.dto';
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

  @Prop({ type: Types.ObjectId, ref: User.name })
  user: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: PackageProxy.name })
  packageProxy: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: Location.name })
  location: Types.ObjectId;

  @Prop({ type: Object })
  detailTemplate: OrderDetailTemplateDto;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
