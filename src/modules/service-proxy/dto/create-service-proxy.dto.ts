import { IsNotEmpty } from 'class-validator';

export class CreateServiceProxyDto {
  @IsNotEmpty({ message: 'service proxy name không được để trống' })
  name: string;

  @IsNotEmpty({ message: 'service proxy type không được để trống' })
  proxyType: string;
}
