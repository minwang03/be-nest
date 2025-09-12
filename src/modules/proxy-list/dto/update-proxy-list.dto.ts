import { PartialType } from '@nestjs/mapped-types';
import { CreateProxyListDto } from '@/modules/proxy-list/dto/create-proxy-list.dto';

export class UpdateProxyListDto extends PartialType(CreateProxyListDto) {}
