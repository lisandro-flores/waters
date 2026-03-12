import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Pago, Factura, Usuario } from '../common/entities';
import { EstadoFactura, MetodoPago } from '../common/enums';
import {
  BusinessException,
  ResourceNotFoundException,
} from '../common/exceptions';

@Injectable()
export class PagoService {
  constructor(
    @InjectRepository(Pago)
    private readonly pagoRepo: Repository<Pago>,
    @InjectRepository(Factura)
    private readonly facturaRepo: Repository<Factura>,
  ) {}

  async registrarPago(
    facturaId: number,
    monto: number,
    metodoPago: MetodoPago,
    referencia: string | undefined,
    cajero: Usuario | null,
  ): Promise<Pago> {
    const factura = await this.facturaRepo.findOne({
      where: { id: facturaId },
    });
    if (!factura)
      throw new ResourceNotFoundException('Factura', facturaId);

    if (
      factura.estado === EstadoFactura.PAGADA ||
      factura.estado === EstadoFactura.ANULADA
    ) {
      throw new BusinessException(
        'La factura ' + factura.numeroFactura + ' no admite más pagos',
      );
    }

    if (monto <= 0) {
      throw new BusinessException(
        'El monto del pago debe ser mayor a cero',
      );
    }

    const pago = this.pagoRepo.create({
      facturaId,
      monto: monto.toFixed(2),
      fechaPago: new Date().toISOString().split('T')[0],
      metodoPago,
      referencia: referencia ?? null,
      cajeroId: cajero?.id ?? null,
    });

    await this.pagoRepo.save(pago);
    await this.actualizarEstadoFactura(factura);

    return pago;
  }

  async getPorFactura(facturaId: number): Promise<Pago[]> {
    return this.pagoRepo.find({ where: { facturaId } });
  }

  private async actualizarEstadoFactura(factura: Factura): Promise<void> {
    const result = await this.pagoRepo
      .createQueryBuilder('p')
      .select('COALESCE(SUM(CAST(p.monto AS DECIMAL)), 0)', 'total')
      .where('p.factura_id = :facturaId', { facturaId: factura.id })
      .getRawOne();

    const totalPagado = parseFloat(result?.total ?? '0');
    const totalFactura = parseFloat(factura.totalPagar);

    if (totalPagado >= totalFactura) {
      factura.estado = EstadoFactura.PAGADA;
    } else if (totalPagado > 0) {
      factura.estado = EstadoFactura.PAGADA_PARCIAL;
    }

    await this.facturaRepo.save(factura);
  }
}
