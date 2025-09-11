import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
  @Prop()
  username: string;

  @Prop()
  email: string;

  @Prop()
  password: string;

  @Prop({ default: 'USERS' })
  role: string;

  @Prop()
  phone: string;

  @Prop({ default: false })
  isActive: boolean;

  @Prop({ type: String, default: null })
  codeId: string | null;

  @Prop()
  codeExpired: Date;

  @Prop()
  lastLogin: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
