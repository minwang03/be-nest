import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateOrderDto {
  @IsOptional()
  @IsNumber({}, { message: 'expiry phải là số' })
  quantity: number;

  @IsOptional()
  @IsNumber({}, { message: 'expiry phải là số' })
  sumcost: number;

  @IsNotEmpty({ message: 'user không được để trống' })
  @IsString()
  user: string;
}
