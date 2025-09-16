import {
  IsNumber,
  IsOptional,
  IsString,
  IsEnum,
  ValidateNested,
} from 'class-validator';
import { CreateOrderDetailDto } from '@/modules/order-detail/dto/create-order-detail.dto';
import { Type } from 'class-transformer';

export enum OrderStatus {
  PENDING = 'pending',
  PAID = 'paid',
  ACTIVE = 'active',
  CANCELLED = 'cancelled',
}

export class CreateOrderDto {
  @IsString()
  user: string;

  @IsString()
  packageProxy: string;

  @IsString()
  location: string;

  @IsNumber()
  quantity: number;

  @IsOptional()
  @IsEnum(OrderStatus, { message: 'status không hợp lệ' })
  status: OrderStatus;

  @ValidateNested()
  @Type(() => CreateOrderDetailDto)
  @IsOptional()
  detailTemplate?: CreateOrderDetailDto;
}
