import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument} from 'mongoose';

export type ProxyListDocument = HydratedDocument<ProxyList>;

@Schema({ timestamps: true })
export class ProxyList {
  @Prop()
  name: string;

 @Prop()
  note: string;
}

export const ProxyListSchema = SchemaFactory.createForClass(ProxyList);