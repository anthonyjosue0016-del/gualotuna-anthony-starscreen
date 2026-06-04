import { IsString, IsOptional, IsBoolean } from 'class-validator';

export class UpdateStaffDto {
  @IsOptional()
  @IsString()
  nombre?: string;

  @IsOptional()
  @IsString()
  rol?: string;

  @IsOptional()
  @IsBoolean()
  activo?: boolean;
}
