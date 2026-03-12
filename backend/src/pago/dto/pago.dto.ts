import {
  IsNotEmpty,
  IsOptional,
  IsNumber,
  IsEnum,
  IsString,
  Min,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { MetodoPago } from '../../common/enums';

export class PagoRequest {
  @ApiProperty()
  @IsNotEmpty({ message: 'El ID de factura es requerido' })
  @IsNumber()
  facturaId!: number;

  @ApiProperty()
  @IsNotEmpty({ message: 'El monto es requerido' })
  @IsNumber()
  @Min(0.01, { message: 'El monto debe ser mayor a cero' })
  monto!: number;

  @ApiPropertyOptional({ enum: MetodoPago })
  @IsOptional()
  @IsEnum(MetodoPago)
  metodoPago?: MetodoPago = MetodoPago.EFECTIVO;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  referencia?: string;
}
