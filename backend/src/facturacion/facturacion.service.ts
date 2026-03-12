import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  Factura,
  Lectura,
  Tarifa,
  TarifaRango,
  Suscriptor,
} from '../common/entities';
import { EstadoFactura, TipoSuscriptor } from '../common/enums';
import {
  BusinessException,
  ResourceNotFoundException,
} from '../common/exceptions';

@Injectable()
export class FacturacionService {
  private readonly logger = new Logger(FacturacionService.name);

  constructor(
    @InjectRepository(Factura)
    private readonly facturaRepo: Repository<Factura>,
    @InjectRepository(Lectura)
    private readonly lecturaRepo: Repository<Lectura>,
    @InjectRepository(Tarifa)
    private readonly tarifaRepo: Repository<Tarifa>,
  ) {}

  async generarFactura(lecturaId: number, comunidadId: number): Promise<Factura> {
    const lectura = await this.lecturaRepo.findOne({
      where: { id: lecturaId },
      relations: ['medidor', 'medidor.suscriptor'],
    });
    if (!lectura)
      throw new ResourceNotFoundException('Lectura', lecturaId);

    const suscriptor = lectura.medidor.suscriptor;
    const numFactura = this.buildNumeroFactura(
      suscriptor,
      lectura.anio,
      lectura.mes,
    );

    const existe = await this.facturaRepo.findOne({
      where: { numeroFactura: numFactura },
    });
    if (existe) {
      throw new BusinessException('Ya existe una factura para este período');
    }

    const hoy = new Date().toISOString().split('T')[0];
    const tarifa = await this.tarifaRepo
      .createQueryBuilder('t')
      .leftJoinAndSelect('t.rangos', 'r')
      .where('t.comunidad_id = :comunidadId', { comunidadId })
      .andWhere('t.tipo_suscriptor = :tipo', { tipo: suscriptor.tipo })
      .andWhere('t.activo = true')
      .andWhere('(t.vigencia_desde IS NULL OR t.vigencia_desde <= :fecha)', {
        fecha: hoy,
      })
      .andWhere('(t.vigencia_hasta IS NULL OR t.vigencia_hasta >= :fecha)', {
        fecha: hoy,
      })
      .orderBy('t.vigencia_desde', 'DESC')
      .getOne();

    if (!tarifa) {
      throw new BusinessException(
        'No hay tarifa vigente para el tipo: ' + suscriptor.tipo,
      );
    }

    const montoConsumo = this.calcularMontoConsumo(
      lectura.consumoM3,
      tarifa.rangos,
    );
    const cuotaFija = parseFloat(tarifa.cuotaFija);
    const total = cuotaFija + montoConsumo;

    const fechaEmision = new Date();
    const fechaVencimiento = new Date();
    fechaVencimiento.setDate(fechaVencimiento.getDate() + tarifa.diasGracia);

    const factura = this.facturaRepo.create({
      numeroFactura: numFactura,
      suscriptorId: suscriptor.id,
      lecturaId: lectura.id,
      tarifaId: tarifa.id,
      anio: lectura.anio,
      mes: lectura.mes,
      consumoM3: lectura.consumoM3,
      montoBase: tarifa.cuotaFija,
      montoConsumo: montoConsumo.toFixed(2),
      totalPagar: total.toFixed(2),
      fechaEmision: fechaEmision.toISOString().split('T')[0],
      fechaVencimiento: fechaVencimiento.toISOString().split('T')[0],
      estado: EstadoFactura.PENDIENTE,
    });

    return this.facturaRepo.save(factura);
  }

  calcularMontoConsumo(consumoM3: number, rangos: TarifaRango[]): number {
    let total = 0;
    let restante = consumoM3;

    const sortedRangos = [...rangos].sort(
      (a, b) => a.rangoDesde - b.rangoDesde,
    );

    for (const rango of sortedRangos) {
      if (restante <= 0) break;

      const finRango =
        rango.rangoHasta != null ? rango.rangoHasta : Number.MAX_SAFE_INTEGER;
      const limiteRango = finRango - rango.rangoDesde;
      const consumoEnRango = Math.min(restante, limiteRango);

      total +=
        Math.round(consumoEnRango * parseFloat(rango.precioPorM3) * 100) / 100;
      restante -= consumoEnRango;
    }

    return total;
  }

  async generarFacturasMasivas(
    comunidadId: number,
    anio: number,
    mes: number,
  ): Promise<number> {
    const lecturas = await this.lecturaRepo
      .createQueryBuilder('l')
      .innerJoinAndSelect('l.medidor', 'm')
      .innerJoinAndSelect('m.suscriptor', 's')
      .where('s.comunidad_id = :comunidadId', { comunidadId })
      .andWhere('l.anio = :anio', { anio })
      .andWhere('l.mes = :mes', { mes })
      .getMany();

    let generadas = 0;
    for (const lectura of lecturas) {
      try {
        await this.generarFactura(lectura.id, comunidadId);
        generadas++;
      } catch (e: any) {
        this.logger.warn(
          `Factura ya existente para lectura ${lectura.id}: ${e.message}`,
        );
      }
    }
    return generadas;
  }

  private buildNumeroFactura(
    suscriptor: Suscriptor,
    anio: number,
    mes: number,
  ): string {
    return `${suscriptor.numeroCuenta}-${anio}${String(mes).padStart(2, '0')}`;
  }
}
