import { IsString, IsUUID, IsNumber, IsBoolean, IsOptional, Min } from 'class-validator';

export class UpdatePeliculaDto {
  @IsOptional()
  @IsString()
  titulo?: string;

  @IsOptional()
  @IsString()
  codigo?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  duracion_minutos?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  precio_entrada?: number;

  @IsOptional()
  @IsUUID()
  generoId?: string;

  @IsOptional()
  @IsBoolean()
  en_cartelera?: boolean;
}