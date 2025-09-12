import { PartialType } from '@nestjs/mapped-types';
import { CreatePackageProxyDto } from '@/modules/package-proxy/dto/create-package-proxy.dto';

export class UpdatePackageProxyDto extends PartialType(CreatePackageProxyDto) {}
