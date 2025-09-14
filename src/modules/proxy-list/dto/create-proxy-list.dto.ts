import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateProxyListDto {
  @IsNotEmpty({ message: 'proxy list name không được để trống' })
  name: string;

  @IsOptional()
  note: string;
}