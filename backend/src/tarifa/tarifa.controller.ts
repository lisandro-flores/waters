import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  ParseIntPipe,
  HttpCode,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { TarifaService } from './tarifa.service';
import { TarifaRequest } from './dto/tarifa.dto';
import { ComunidadId } from '../common/decorators';
import { RolesGuard, Roles } from '../auth/guards/roles.guard';

@ApiTags('Tarifas')
@ApiBearerAuth()
@Controller('api/v1/tarifas')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class TarifaController {
  constructor(private readonly tarifaService: TarifaService) {}

  @Get()
  @ApiOperation({ summary: 'Listar tarifas activas de la comunidad' })
  async listar(@ComunidadId() comunidadId: number) {
    return this.tarifaService.listarActivas(comunidadId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener tarifa por ID' })
  async getById(
    @Param('id', ParseIntPipe) id: number,
    @ComunidadId() comunidadId: number,
  ) {
    return this.tarifaService.obtenerPorId(id, comunidadId);
  }

  @Post()
  @Roles('SUPER_ADMIN', 'ADMIN')
  @HttpCode(201)
  @ApiOperation({ summary: 'Crear nueva tarifa con rangos escalonados' })
  async crear(
    @Body() dto: TarifaRequest,
    @ComunidadId() comunidadId: number,
  ) {
    return this.tarifaService.crear(dto, comunidadId);
  }

  @Put(':id')
  @Roles('SUPER_ADMIN', 'ADMIN')
  @ApiOperation({ summary: 'Actualizar tarifa y sus rangos' })
  async actualizar(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: TarifaRequest,
    @ComunidadId() comunidadId: number,
  ) {
    return this.tarifaService.actualizar(id, dto, comunidadId);
  }

  @Delete(':id')
  @Roles('SUPER_ADMIN', 'ADMIN')
  @HttpCode(204)
  @ApiOperation({ summary: 'Desactivar tarifa' })
  async desactivar(
    @Param('id', ParseIntPipe) id: number,
    @ComunidadId() comunidadId: number,
  ) {
    return this.tarifaService.desactivar(id, comunidadId);
  }
}
