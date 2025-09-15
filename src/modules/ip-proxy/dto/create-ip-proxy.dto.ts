import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateIpProxyDto {
  @IsNotEmpty({ message: 'address không được để trống' })
  address: string;

  @IsNotEmpty({ message: 'port không được để trống' })
  @IsNumber({}, { message: 'port phải là số' })
  port: number;

  @IsNotEmpty({ message: 'package proxy không được để trống' })
  @IsString()
  packageProxy: string;

  @IsNotEmpty({ message: 'proxy list không được để trống' })
  @IsString()
  proxyList: string;

  @IsNotEmpty({ message: 'location không được để trống' })
  @IsString()
  location: string;
}
