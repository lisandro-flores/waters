import {
  Controller,
  Get,
  Patch,
  Param,
  Query,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AlertaService } from './alerta.service';
import { EstadoAlerta } from '../common/enums';
import { ComunidadId, CurrentUser } from '../common/decorators';
import { RolesGuard, Roles } from '../auth/guards/roles.guard';

@ApiTags('Alertas')
@ApiBearerAuth()
@Controller('api/v1/alertas')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class AlertaController {
  constructor(private readonly alertaService: AlertaService) {}

  @Get()
  @ApiOperation({ summary: 'Listar alertas de la comunidad (filtro por estado)' })
  async listar(
    @ComunidadId() comunidadId: number,
    @Query('estado') estado?: string,
  ) {
    if (estado) {
      return this.alertaService.listarPorEstado(
        comunidadId,
        estado as EstadoAlerta,
      );
    }
    return this.alertaService.getAlertasPendientes(comunidadId);
  }

  @Patch(':id/resolver')
  @Roles('SUPER_ADMIN', 'ADMIN', 'OPERADOR')
  @ApiOperation({ summary: 'Marcar alerta como resuelta' })
  async resolver(
    @Param('id', ParseIntPipe) id: number,
    @ComunidadId() comunidadId: number,
    @CurrentUser() user: any,
  ) {
    return this.alertaService.resolver(id, comunidadId, user.email);
  }

  @Patch(':id/descartar')
  @Roles('SUPER_ADMIN', 'ADMIN')
  @ApiOperation({ summary: 'Descartar una alerta' })
  async descartar(
    @Param('id', ParseIntPipe) id: number,
    @ComunidadId() comunidadId: number,
  ) {
    return this.alertaService.descartar(id, comunidadId);
  }
}
