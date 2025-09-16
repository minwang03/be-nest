import {
  IsNumber,
  IsOptional,
  IsString,
  IsEnum,
  IsBoolean,
  ValidateNested,
  IsNotEmpty,
} from 'class-validator';
import { Type } from 'class-transformer';

export enum OrderStatus {
  PENDING = 'pending',
  PAID = 'paid',
  ACTIVE = 'active',
  CANCELLED = 'cancelled',
}

export class OrderDetailTemplateDto {
  @IsString()
  @IsNotEmpty()
  protocol: string;

  @IsBoolean()
  autochangeIP: boolean;

  @IsString()
  @IsNotEmpty()
  proxysecurity: string;

  @IsOptional()
  @IsString()
  allowedIP?: string;

  @IsOptional()
  @IsString()
  allowedUser?: string;

  @IsOptional()
  @IsString()
  allowedPass?: string;

  @IsBoolean()
  autoextent: boolean;

  @IsOptional()
  @IsString()
  note?: string;
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
  @Type(() => OrderDetailTemplateDto)
  @IsOptional()
  detailTemplate?: OrderDetailTemplateDto;
}
