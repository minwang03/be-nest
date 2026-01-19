import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<LoginSession>;

@Schema({ timestamps: true })
export class LoginSession {
  @Prop({ type: String, required: true, ref: 'User' })
  userId: string;

  @Prop({ required: true })
  accessToken: string;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ required: true })
  expiredAt: Date;

  @Prop()
  ipAddress: string;

  @Prop()
  userAgent: string;
}

export const LoginSessionSchema = SchemaFactory.createForClass(LoginSession);
