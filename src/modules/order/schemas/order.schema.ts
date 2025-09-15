import { User } from '@/modules/users/schemas/user.schema';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type OrderDocument = HydratedDocument<Order>;

@Schema({ timestamps: true })
export class Order {
  @Prop()
  quantity: string;

  @Prop()
  sumcost: number;

  @Prop({ type: Types.ObjectId, ref: User.name })
  user: Types.ObjectId;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
