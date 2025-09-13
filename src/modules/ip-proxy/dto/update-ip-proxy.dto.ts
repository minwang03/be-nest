import { PartialType } from '@nestjs/mapped-types';
import { CreateIpProxyDto } from '@/modules/ip-proxy/dto/create-ip-proxy.dto';

export class UpdateIpProxyDto extends PartialType(CreateIpProxyDto) {}
