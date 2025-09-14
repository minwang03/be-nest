import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreatePackageProxyDto {
  @IsNotEmpty({ message: 'name không được để trống' })
  name: string;

  @IsNotEmpty({ message: 'expiry không được để trống' })
  @IsNumber({}, { message: 'expiry phải là số' })
  expiry: number;

  @IsNotEmpty({ message: 'cost không được để trống' })
  @IsNumber({}, { message: 'cost phải là số' })
  cost: number;

  @IsNotEmpty({ message: 'service proxy không được để trống' })
  @IsString()
  serviceProxy: string;
}
