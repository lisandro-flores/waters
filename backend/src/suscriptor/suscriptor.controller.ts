import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  Query,
  ParseIntPipe,
  HttpCode,
  UseGuards,
  DefaultValuePipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { SuscriptorService } from './suscriptor.service';
import { SuscriptorRequest } from './dto/suscriptor.dto';
import { ComunidadId } from '../common/decorators';
import { RolesGuard, Roles } from '../auth/guards/roles.guard';

@ApiTags('Suscriptores')
@ApiBearerAuth()
@Controller('api/v1/suscriptores')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class SuscriptorController {
  constructor(private readonly suscriptorService: SuscriptorService) {}

  @Get()
  @ApiOperation({ summary: 'Listar suscriptores paginados de la comunidad' })
  async listar(
    @ComunidadId() comunidadId: number,
    @Query('q') q?: string,
    @Query('page', new DefaultValuePipe(0), ParseIntPipe) page?: number,
    @Query('size', new DefaultValuePipe(20), ParseIntPipe) size?: number,
  ) {
    return this.suscriptorService.listar(comunidadId, q, page ?? 0, size ?? 20);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener suscriptor por ID' })
  async getById(
    @Param('id', ParseIntPipe) id: number,
    @ComunidadId() comunidadId: number,
  ) {
    return this.suscriptorService.obtenerPorId(id, comunidadId);
  }

  @Post()
  @Roles('SUPER_ADMIN', 'ADMIN', 'OPERADOR')
  @HttpCode(201)
  @ApiOperation({ summary: 'Crear nuevo suscriptor' })
  async crear(
    @Body() dto: SuscriptorRequest,
    @ComunidadId() comunidadId: number,
  ) {
    return this.suscriptorService.crear(dto, comunidadId);
  }

  @Put(':id')
  @Roles('SUPER_ADMIN', 'ADMIN', 'OPERADOR')
  @ApiOperation({ summary: 'Actualizar suscriptor' })
  async actualizar(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: SuscriptorRequest,
    @ComunidadId() comunidadId: number,
  ) {
    return this.suscriptorService.actualizar(id, dto, comunidadId);
  }
}
