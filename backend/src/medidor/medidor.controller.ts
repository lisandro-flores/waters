import {
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Body,
  Param,
  Query,
  ParseIntPipe,
  HttpCode,
  UseGuards,
  DefaultValuePipe,
  ParseEnumPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { MedidorService } from './medidor.service';
import { MedidorRequest } from './dto/medidor.dto';
import { EstadoMedidor } from '../common/enums';
import { ComunidadId } from '../common/decorators';
import { RolesGuard, Roles } from '../auth/guards/roles.guard';

@ApiTags('Medidores')
@ApiBearerAuth()
@Controller('api/v1/medidores')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class MedidorController {
  constructor(private readonly medidorService: MedidorService) {}

  @Get('suscriptor/:suscriptorId')
  @ApiOperation({ summary: 'Listar medidores de un suscriptor' })
  async getPorSuscriptor(
    @Param('suscriptorId', ParseIntPipe) suscriptorId: number,
  ) {
    return this.medidorService.getPorSuscriptor(suscriptorId);
  }

  @Get()
  @ApiOperation({ summary: 'Listar medidores de la comunidad por estado' })
  async listar(
    @ComunidadId() comunidadId: number,
    @Query('estado') estado?: string,
  ) {
    const estadoEnum =
      (estado as EstadoMedidor) || EstadoMedidor.ACTIVO;
    return this.medidorService.getPorComunidadYEstado(comunidadId, estadoEnum);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener medidor por ID' })
  async getById(
    @Param('id', ParseIntPipe) id: number,
    @ComunidadId() comunidadId: number,
  ) {
    return this.medidorService.obtenerPorId(id, comunidadId);
  }

  @Post()
  @Roles('SUPER_ADMIN', 'ADMIN', 'OPERADOR')
  @HttpCode(201)
  @ApiOperation({ summary: 'Registrar nuevo medidor' })
  async crear(
    @Body() dto: MedidorRequest,
    @ComunidadId() comunidadId: number,
  ) {
    return this.medidorService.crear(dto, comunidadId);
  }

  @Put(':id')
  @Roles('SUPER_ADMIN', 'ADMIN', 'OPERADOR')
  @ApiOperation({ summary: 'Actualizar medidor' })
  async actualizar(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: MedidorRequest,
    @ComunidadId() comunidadId: number,
  ) {
    return this.medidorService.actualizar(id, dto, comunidadId);
  }

  @Patch(':id/baja')
  @Roles('SUPER_ADMIN', 'ADMIN')
  @ApiOperation({ summary: 'Dar de baja un medidor' })
  async darDeBaja(
    @Param('id', ParseIntPipe) id: number,
    @ComunidadId() comunidadId: number,
  ) {
    return this.medidorService.darDeBaja(id, comunidadId);
  }
}
