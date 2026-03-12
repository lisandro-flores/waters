import {
  IsNotEmpty,
  IsOptional,
  MaxLength,
  IsEnum,
  IsNumber,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { EstadoMedidor } from '../../common/enums';

export class MedidorRequest {
  @ApiProperty()
  @IsNotEmpty({ message: 'El número de serie es requerido' })
  @MaxLength(50)
  numeroSerie!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @MaxLength(80)
  marca?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @MaxLength(10)
  diametro?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  lecturaInicial?: number = 0;

  @ApiPropertyOptional({ enum: EstadoMedidor })
  @IsOptional()
  @IsEnum(EstadoMedidor)
  estado?: EstadoMedidor = EstadoMedidor.ACTIVO;

  @ApiPropertyOptional()
  @IsOptional()
  fechaInstalacion?: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'El ID del suscriptor es requerido' })
  @IsNumber()
  suscriptorId!: number;
}
