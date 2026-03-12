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
import { ComunidadService } from './comunidad.service';
import { ComunidadRequest } from './dto/comunidad.dto';
import { Comunidad } from '../common/entities';
import { ComunidadId } from '../common/decorators';
import { RolesGuard, Roles } from '../auth/guards/roles.guard';

@ApiTags('Comunidades')
@ApiBearerAuth()
@Controller('api/v1/comunidades')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class ComunidadController {
  constructor(private readonly comunidadService: ComunidadService) {}

  @Get()
  @Roles('SUPER_ADMIN')
  @ApiOperation({ summary: 'Listar todas las comunidades activas' })
  async listar(): Promise<Comunidad[]> {
    return this.comunidadService.listarActivas();
  }

  @Get('mi-comunidad')
  @ApiOperation({ summary: 'Obtener datos de la comunidad del usuario actual' })
  async getMiComunidad(@ComunidadId() comunidadId: number): Promise<Comunidad> {
    return this.comunidadService.obtenerPorId(comunidadId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener comunidad por ID' })
  async getById(@Param('id', ParseIntPipe) id: number): Promise<Comunidad> {
    return this.comunidadService.obtenerPorId(id);
  }

  @Post()
  @Roles('SUPER_ADMIN')
  @HttpCode(201)
  @ApiOperation({ summary: 'Crear nueva comunidad' })
  async crear(@Body() dto: ComunidadRequest): Promise<Comunidad> {
    return this.comunidadService.crear(dto);
  }

  @Put(':id')
  @Roles('SUPER_ADMIN', 'ADMIN')
  @ApiOperation({ summary: 'Actualizar datos de la comunidad' })
  async actualizar(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: ComunidadRequest,
  ): Promise<Comunidad> {
    return this.comunidadService.actualizar(id, dto);
  }

  @Delete(':id')
  @Roles('SUPER_ADMIN')
  @HttpCode(204)
  @ApiOperation({ summary: 'Desactivar comunidad' })
  async desactivar(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.comunidadService.desactivar(id);
  }
}
