import {
  IsNotEmpty,
  IsOptional,
  IsNumber,
  IsEnum,
  IsString,
  MaxLength,
  Min,
  ValidateNested,
  IsArray,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { TipoSuscriptor } from '../../common/enums';

export class RangoRequest {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  rangoDesde!: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  rangoHasta?: number | null;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  precioPorM3!: number;
}

export class TarifaRequest {
  @ApiProperty()
  @IsNotEmpty({ message: 'El nombre es requerido' })
  @IsString()
  @MaxLength(100)
  nombre!: string;

  @ApiProperty({ enum: TipoSuscriptor })
  @IsNotEmpty({ message: 'El tipo de suscriptor es requerido' })
  @IsEnum(TipoSuscriptor)
  tipoSuscriptor!: TipoSuscriptor;

  @ApiProperty()
  @IsNotEmpty({ message: 'La cuota fija es requerida' })
  @IsNumber()
  cuotaFija!: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  porcentajeMora?: number = 0.02;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Min(0)
  diasGracia?: number = 15;

  @ApiPropertyOptional()
  @IsOptional()
  vigenciaDesde?: string;

  @ApiPropertyOptional()
  @IsOptional()
  vigenciaHasta?: string;

  @ApiPropertyOptional({ type: [RangoRequest] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => RangoRequest)
  rangos?: RangoRequest[];
}
