import {
  IsNotEmpty,
  IsOptional,
  IsNumber,
  Min,
  IsBoolean,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class LecturaRequest {
  @ApiProperty()
  @IsNotEmpty({ message: 'El ID del medidor es requerido' })
  @IsNumber()
  medidorId!: number;

  @ApiProperty()
  @IsNotEmpty({ message: 'La lectura anterior es requerida' })
  @IsNumber()
  @Min(0, { message: 'La lectura anterior no puede ser negativa' })
  lecturaAnterior!: number;

  @ApiProperty()
  @IsNotEmpty({ message: 'La lectura actual es requerida' })
  @IsNumber()
  @Min(0, { message: 'La lectura actual no puede ser negativa' })
  lecturaActual!: number;

  @ApiPropertyOptional()
  @IsOptional()
  fechaLectura?: string;

  @ApiPropertyOptional()
  @IsOptional()
  observaciones?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  estimada?: boolean = false;
}
