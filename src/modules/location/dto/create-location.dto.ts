import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateLocationDto {
  @IsNotEmpty({ message: 'location name không được để trống' })
  name: string;

  @IsOptional()
  code: string;
}
