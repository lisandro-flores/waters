import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ReporteService } from './reporte.service';
import { ComunidadId } from '../common/decorators';
import { RolesGuard } from '../auth/guards/roles.guard';

@ApiTags('Reportes')
@ApiBearerAuth()
@Controller('api/v1/reportes')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class ReporteController {
  constructor(private readonly reporteService: ReporteService) {}

  @Get('dashboard')
  @ApiOperation({ summary: 'Datos del dashboard: KPIs principales' })
  async getDashboard(@ComunidadId() comunidadId: number) {
    return this.reporteService.getDashboard(comunidadId);
  }

  @Get('morosidad')
  @ApiOperation({ summary: 'Reporte de cuentas morosas' })
  async getMorosidad(@ComunidadId() comunidadId: number) {
    return this.reporteService.getReporteMorosidad(comunidadId);
  }

  @Get('recaudacion-mensual')
  @ApiOperation({ summary: 'Recaudación de los últimos 12 meses' })
  async getRecaudacionMensual(@ComunidadId() comunidadId: number) {
    return this.reporteService.getRecaudacionMensual(comunidadId);
  }
}
