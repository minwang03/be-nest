import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Model } from 'mongoose';
import slugify from 'slugify';

export type ServiceProxyDocument = HydratedDocument<ServiceProxy>;

@Schema({ timestamps: true })
export class ServiceProxy {
  @Prop()
  name: string;

  @Prop()
  proxyType: string;

  @Prop({ unique: true })
  slug: string;

  @Prop({ default: true })
  isActive: boolean;
}

export const ServiceProxySchema = SchemaFactory.createForClass(ServiceProxy);

ServiceProxySchema.pre<ServiceProxy>('save', async function (next) {
  if (this.name && this.proxyType) {
    const baseSlug =
      slugify(this.name, { lower: true, strict: true }) +
      '-' +
      slugify(this.proxyType, { lower: true, strict: true });

    if (!this.slug) {
      const ServiceProxyModel = this.constructor as Model<ServiceProxyDocument>;
      let slug = baseSlug;
      let counter = 1;

      while (await ServiceProxyModel.findOne({ slug })) {
        slug = `${baseSlug}-${counter}`;
        counter++;
      }

      this.slug = slug;
    }
  }
  next();
});
