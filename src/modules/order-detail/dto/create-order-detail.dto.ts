import { IsString, IsOptional, IsBoolean, IsNotEmpty } from 'class-validator';

export class CreateOrderDetailDto {
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
