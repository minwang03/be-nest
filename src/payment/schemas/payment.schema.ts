import { User } from '@/modules/users/schemas/user.schema';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type PaymentDocument = HydratedDocument<Payment>;

@Schema({ timestamps: true })
export class Payment {
  @Prop({ unique: true, required: true })
  orderId: string;

  @Prop({ required: true })
  amount: number;

  @Prop({ enum: ['pending', 'paid', 'failed'], default: 'pending' })
  status: 'pending' | 'paid' | 'failed';

  @Prop()
  vnp_TransactionNo?: string;

  @Prop()
  bankCode?: string;

  @Prop({ type: Types.ObjectId, ref: User.name })
  user: Types.ObjectId;
}

export const PaymentSchema = SchemaFactory.createForClass(Payment);
