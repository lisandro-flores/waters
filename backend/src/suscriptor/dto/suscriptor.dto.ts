import {
  IsNotEmpty,
  IsOptional,
  MaxLength,
  IsEnum,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  TipoSuscriptor,
  EstadoSuscriptor,
} from '../../common/enums';

export class SuscriptorRequest {
  @ApiProperty()
  @IsNotEmpty({ message: 'El número de cuenta es requerido' })
  @MaxLength(20)
  numeroCuenta!: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'El nombre es requerido' })
  @MaxLength(100)
  nombre!: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'El apellido es requerido' })
  @MaxLength(100)
  apellido!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @MaxLength(20)
  identificacion?: string;

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
  @MaxLength(150)
  email?: string;

  @ApiPropertyOptional({ enum: TipoSuscriptor })
  @IsOptional()
  @IsEnum(TipoSuscriptor)
  tipo?: TipoSuscriptor = TipoSuscriptor.DOMICILIAR;

  @ApiPropertyOptional({ enum: EstadoSuscriptor })
  @IsOptional()
  @IsEnum(EstadoSuscriptor)
  estado?: EstadoSuscriptor = EstadoSuscriptor.ACTIVO;
}
