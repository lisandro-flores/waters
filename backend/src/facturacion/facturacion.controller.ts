import {
  Controller,
  Post,
  Param,
  Query,
  ParseIntPipe,
  HttpCode,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { FacturacionService } from './facturacion.service';
import { ComunidadId } from '../common/decorators';
import { RolesGuard, Roles } from '../auth/guards/roles.guard';

@ApiTags('Facturación')
@ApiBearerAuth()
@Controller('api/v1/facturacion')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class FacturacionController {
  constructor(private readonly facturacionService: FacturacionService) {}

  @Post('generar/:lecturaId')
  @Roles('SUPER_ADMIN', 'ADMIN', 'CAJERO')
  @HttpCode(201)
  @ApiOperation({ summary: 'Generar factura individual para una lectura' })
  async generarFactura(
    @Param('lecturaId', ParseIntPipe) lecturaId: number,
    @ComunidadId() comunidadId: number,
  ) {
    return this.facturacionService.generarFactura(lecturaId, comunidadId);
  }

  @Post('generar-masivo')
  @Roles('SUPER_ADMIN', 'ADMIN')
  @ApiOperation({ summary: 'Generación masiva de facturas para todo el período' })
  async generarMasivo(
    @Query('anio', ParseIntPipe) anio: number,
    @Query('mes', ParseIntPipe) mes: number,
    @ComunidadId() comunidadId: number,
  ) {
    const generadas = await this.facturacionService.generarFacturasMasivas(
      comunidadId,
      anio,
      mes,
    );
    return { facturasGeneradas: generadas, anio, mes };
  }
}
