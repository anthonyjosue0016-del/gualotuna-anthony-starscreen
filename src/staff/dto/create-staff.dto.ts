import { IsString, IsNotEmpty } from 'class-validator';

export class CreateStaffDto {
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @IsString()
  @IsNotEmpty()
  rol: string;
}
