import { PartialType } from '@nestjs/mapped-types';
import { CreateLocationDto } from '@/modules/location/dto/create-location.dto';

export class UpdateLocationDto extends PartialType(CreateLocationDto) {}
