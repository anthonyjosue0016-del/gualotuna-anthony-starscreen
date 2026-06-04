import { IsString, IsNotEmpty } from 'class-validator';

export class CreateGeneroDto {
  @IsString()
  @IsNotEmpty()
  nombre!: string;
}