import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Factura, Pago, Suscriptor } from '../common/entities';
import { EstadoFactura, EstadoSuscriptor } from '../common/enums';

@Injectable()
export class ReporteService {
  constructor(
    @InjectRepository(Factura)
    private readonly facturaRepo: Repository<Factura>,
    @InjectRepository(Pago)
    private readonly pagoRepo: Repository<Pago>,
    @InjectRepository(Suscriptor)
    private readonly suscriptorRepo: Repository<Suscriptor>,
  ) {}

  async getDashboard(comunidadId: number): Promise<Record<string, any>> {
    const hoy = new Date();
    const inicioMes = new Date(hoy.getFullYear(), hoy.getMonth(), 1)
      .toISOString()
      .split('T')[0];
    const hoyStr = hoy.toISOString().split('T')[0];

    const totalSuscriptores = await this.suscriptorRepo.count({
      where: { comunidadId, estado: EstadoSuscriptor.ACTIVO },
    });

    const facturadoResult = await this.facturaRepo
      .createQueryBuilder('f')
      .select('COALESCE(SUM(CAST(f.total_pagar AS DECIMAL)), 0)', 'total')
      .innerJoin('f.suscriptor', 's')
      .where('s.comunidad_id = :comunidadId', { comunidadId })
      .andWhere('f.anio = :anio', { anio: hoy.getFullYear() })
      .andWhere('f.mes = :mes', { mes: hoy.getMonth() + 1 })
      .andWhere('f.estado != :anulada', { anulada: EstadoFactura.ANULADA })
      .getRawOne();

    const recaudadoResult = await this.pagoRepo
      .createQueryBuilder('p')
      .select('COALESCE(SUM(CAST(p.monto AS DECIMAL)), 0)', 'total')
      .innerJoin('p.factura', 'f')
      .innerJoin('f.suscriptor', 's')
      .where('s.comunidad_id = :comunidadId', { comunidadId })
      .andWhere('p.fecha_pago BETWEEN :desde AND :hasta', {
        desde: inicioMes,
        hasta: hoyStr,
      })
      .getRawOne();

    const pendientes = await this.facturaRepo
      .createQueryBuilder('f')
      .innerJoin('f.suscriptor', 's')
      .where('s.comunidad_id = :comunidadId', { comunidadId })
      .andWhere('f.estado = :estado', { estado: EstadoFactura.PENDIENTE })
      .getCount();

    const morosas = await this.facturaRepo
      .createQueryBuilder('f')
      .innerJoin('f.suscriptor', 's')
      .where('s.comunidad_id = :comunidadId', { comunidadId })
      .andWhere('f.estado IN (:...estados)', {
        estados: [EstadoFactura.PENDIENTE, EstadoFactura.PAGADA_PARCIAL],
      })
      .andWhere('f.fecha_vencimiento < :hoy', { hoy: hoyStr })
      .getCount();

    return {
      totalSuscriptores,
      facturadoMesActual: parseFloat(facturadoResult?.total ?? '0'),
      recaudadoMesActual: parseFloat(recaudadoResult?.total ?? '0'),
      cuentasPendientes: pendientes,
      cuentasMorosas: morosas,
    };
  }

  async getReporteMorosidad(
    comunidadId: number,
  ): Promise<Record<string, any>> {
    const hoy = new Date().toISOString().split('T')[0];

    const facturasMorosas = await this.facturaRepo
      .createQueryBuilder('f')
      .innerJoinAndSelect('f.suscriptor', 's')
      .where('s.comunidad_id = :comunidadId', { comunidadId })
      .andWhere('f.estado IN (:...estados)', {
        estados: [EstadoFactura.PENDIENTE, EstadoFactura.PAGADA_PARCIAL],
      })
      .andWhere('f.fecha_vencimiento < :hoy', { hoy })
      .getMany();

    const totalDeuda = facturasMorosas.reduce(
      (acc, f) => acc + parseFloat(f.totalPagar),
      0,
    );

    return {
      totalFacturasMorosas: facturasMorosas.length,
      totalDeuda,
      facturas: facturasMorosas,
    };
  }

  async getRecaudacionMensual(
    comunidadId: number,
  ): Promise<Record<string, number>> {
    const resultado: Record<string, number> = {};
    const hoy = new Date();

    for (let i = 11; i >= 0; i--) {
      const mes = new Date(hoy.getFullYear(), hoy.getMonth() - i, 1);
      const inicio = new Date(mes.getFullYear(), mes.getMonth(), 1)
        .toISOString()
        .split('T')[0];
      const fin = new Date(mes.getFullYear(), mes.getMonth() + 1, 0)
        .toISOString()
        .split('T')[0];

      const result = await this.pagoRepo
        .createQueryBuilder('p')
        .select('COALESCE(SUM(CAST(p.monto AS DECIMAL)), 0)', 'total')
        .innerJoin('p.factura', 'f')
        .innerJoin('f.suscriptor', 's')
        .where('s.comunidad_id = :comunidadId', { comunidadId })
        .andWhere('p.fecha_pago BETWEEN :desde AND :hasta', {
          desde: inicio,
          hasta: fin,
        })
        .getRawOne();

      const label = `${mes.getFullYear()}/${String(mes.getMonth() + 1).padStart(2, '0')}`;
      resultado[label] = parseFloat(result?.total ?? '0');
    }

    return resultado;
  }
}
