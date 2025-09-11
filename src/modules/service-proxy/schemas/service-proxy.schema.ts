import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument} from 'mongoose';

export type ServiceProxyDocument = HydratedDocument<ServiceProxy>;

@Schema({ timestamps: true })
export class ServiceProxy {
  @Prop()
  name: string;

 @Prop()
  proxyType: string;
}

export const ServiceProxySchema = SchemaFactory.createForClass(ServiceProxy);
