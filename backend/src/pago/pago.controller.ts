import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  ParseIntPipe,
  HttpCode,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PagoService } from './pago.service';
import { PagoRequest } from './dto/pago.dto';
import { Usuario } from '../common/entities';
import { CurrentUser } from '../common/decorators';
import { RolesGuard, Roles } from '../auth/guards/roles.guard';

@ApiTags('Pagos')
@ApiBearerAuth()
@Controller('api/v1/pagos')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class PagoController {
  constructor(
    private readonly pagoService: PagoService,
    @InjectRepository(Usuario)
    private readonly usuarioRepo: Repository<Usuario>,
  ) {}

  @Post()
  @Roles('SUPER_ADMIN', 'ADMIN', 'CAJERO')
  @HttpCode(201)
  @ApiOperation({ summary: 'Registrar un pago sobre una factura' })
  async registrar(
    @Body() dto: PagoRequest,
    @CurrentUser() user: any,
  ) {
    const cajero = await this.usuarioRepo.findOne({
      where: { email: user.email },
    });
    return this.pagoService.registrarPago(
      dto.facturaId,
      dto.monto,
      dto.metodoPago!,
      dto.referencia,
      cajero,
    );
  }

  @Get('factura/:facturaId')
  @ApiOperation({ summary: 'Listar pagos de una factura' })
  async getPorFactura(@Param('facturaId', ParseIntPipe) facturaId: number) {
    return this.pagoService.getPorFactura(facturaId);
  }
}
