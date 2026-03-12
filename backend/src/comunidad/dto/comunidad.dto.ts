import { IsNotEmpty, IsOptional, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ComunidadRequest {
  @ApiProperty()
  @IsNotEmpty({ message: 'El nombre es requerido' })
  @MaxLength(100)
  nombre!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @MaxLength(200)
  direccion?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @MaxLength(20)
  telefono?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @MaxLength(100)
  email?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @MaxLength(20)
  ruc?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @MaxLength(80)
  provincia?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @MaxLength(80)
  municipio?: string;
}
