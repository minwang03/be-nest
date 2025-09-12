import { PartialType } from '@nestjs/mapped-types';
import { CreateServiceProxyDto } from '@/modules/service-proxy/dto/create-service-proxy.dto';

export class UpdateServiceProxyDto extends PartialType(CreateServiceProxyDto) {}
