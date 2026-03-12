import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  ParseIntPipe,
  HttpCode,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { LecturaService } from './lectura.service';
import { LecturaRequest } from './dto/lectura.dto';
import { ComunidadId } from '../common/decorators';
import { RolesGuard, Roles } from '../auth/guards/roles.guard';

@ApiTags('Lecturas')
@ApiBearerAuth()
@Controller('api/v1/lecturas')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class LecturaController {
  constructor(private readonly lecturaService: LecturaService) {}

  @Get('medidor/:medidorId')
  @ApiOperation({ summary: 'Historial de lecturas de un medidor' })
  async getPorMedidor(@Param('medidorId', ParseIntPipe) medidorId: number) {
    return this.lecturaService.getPorMedidor(medidorId);
  }

  @Get('periodo')
  @ApiOperation({ summary: 'Lecturas de la comunidad en un período' })
  async getPorPeriodo(
    @Query('anio', ParseIntPipe) anio: number,
    @Query('mes', ParseIntPipe) mes: number,
    @ComunidadId() comunidadId: number,
  ) {
    return this.lecturaService.getPorPeriodo(comunidadId, anio, mes);
  }

  @Post()
  @Roles('SUPER_ADMIN', 'ADMIN', 'OPERADOR')
  @HttpCode(201)
  @ApiOperation({ summary: 'Registrar nueva lectura de medidor' })
  async registrar(
    @Body() dto: LecturaRequest,
    @ComunidadId() comunidadId: number,
  ) {
    return this.lecturaService.registrar(dto, comunidadId);
  }
}
