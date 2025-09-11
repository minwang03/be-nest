import { PartialType } from '@nestjs/mapped-types';
import { CreateServiceProxyDto } from './create-service-proxy.dto';

export class UpdateServiceProxyDto extends PartialType(CreateServiceProxyDto) {}
