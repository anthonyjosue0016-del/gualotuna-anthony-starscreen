import { IsString, IsUUID, IsNumber, IsBoolean, IsOptional, IsNotEmpty, Min } from 'class-validator';

export class CreatePeliculaDto {
  @IsString()
  @IsNotEmpty()
  titulo!: string;

  @IsString()
  @IsNotEmpty()
  codigo!: string;

  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  duracion_minutos!: number;

  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  precio_entrada!: number;

  @IsUUID()
  @IsNotEmpty()
  generoId!: string;

  @IsOptional()
  @IsBoolean()
  en_cartelera?: boolean;
}