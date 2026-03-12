import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cron } from '@nestjs/schedule';
import {
  Alerta,
  Comunidad,
  Lectura,
  Medidor,
  Usuario,
} from '../common/entities';
import { EstadoAlerta, TipoAlerta } from '../common/enums';
import { ResourceNotFoundException } from '../common/exceptions';

@Injectable()
export class AlertaService {
  private readonly logger = new Logger(AlertaService.name);

  constructor(
    @InjectRepository(Alerta)
    private readonly alertaRepo: Repository<Alerta>,
    @InjectRepository(Comunidad)
    private readonly comunidadRepo: Repository<Comunidad>,
    @InjectRepository(Lectura)
    private readonly lecturaRepo: Repository<Lectura>,
    @InjectRepository(Medidor)
    private readonly medidorRepo: Repository<Medidor>,
    @InjectRepository(Usuario)
    private readonly usuarioRepo: Repository<Usuario>,
  ) {}

  @Cron('0 0 8 1 * *', { name: 'detectar-medidores-sin-lectura' })
  async detectarMedidoresSinLectura(): Promise<void> {
    const ayer = new Date();
    ayer.setDate(ayer.getDate() - 1);
    const mesAnterior = ayer.getMonth() + 1;
    const anio = ayer.getFullYear();

    const comunidades = await this.comunidadRepo.find({
      where: { activo: true },
    });

    for (const comunidad of comunidades) {
      const medidoresSinLectura = await this.medidorRepo
        .createQueryBuilder('m')
        .innerJoin('m.suscriptor', 's')
        .where('s.comunidad_id = :comunidadId', {
          comunidadId: comunidad.id,
        })
        .andWhere("m.estado = 'ACTIVO'")
        .andWhere(
          `NOT EXISTS (SELECT 1 FROM lecturas l WHERE l.medidor_id = m.id AND l.anio = :anio AND l.mes = :mes)`,
          { anio, mes: mesAnterior },
        )
        .getMany();

      for (const medidor of medidoresSinLectura) {
        await this.crearAlerta(
          comunidad,
          medidor,
          TipoAlerta.MEDIDOR_SIN_LECTURA,
          `Medidor ${medidor.numeroSerie} sin lectura en ${anio}/${String(mesAnterior).padStart(2, '0')}`,
        );
      }
    }

    this.logger.log(
      `Verificación de lecturas completada - ${anio}/${mesAnterior}`,
    );
  }

  async detectarConsumoAnomalo(_lectura: Lectura): Promise<void> {
    // TODO: implementar lógica de comparación histórica
  }

  async crearAlerta(
    comunidad: Comunidad,
    medidor: Medidor | null,
    tipo: TipoAlerta,
    mensaje: string,
  ): Promise<Alerta> {
    const alerta = this.alertaRepo.create({
      comunidadId: comunidad.id,
      suscriptorId: medidor?.suscriptorId ?? null,
      tipo,
      mensaje,
      estado: EstadoAlerta.PENDIENTE,
    });
    return this.alertaRepo.save(alerta);
  }

  async getAlertasPendientes(comunidadId: number): Promise<Alerta[]> {
    return this.alertaRepo.find({
      where: { comunidadId, estado: EstadoAlerta.PENDIENTE },
    });
  }

  async listarPorEstado(
    comunidadId: number,
    estado: EstadoAlerta,
  ): Promise<Alerta[]> {
    return this.alertaRepo.find({ where: { comunidadId, estado } });
  }

  async resolver(
    id: number,
    comunidadId: number,
    userEmail: string,
  ): Promise<Alerta> {
    const alerta = await this.alertaRepo.findOne({ where: { id } });
    if (!alerta) throw new ResourceNotFoundException('Alerta', id);
    if (alerta.comunidadId !== Number(comunidadId)) {
      throw new ResourceNotFoundException('Alerta', id);
    }

    const usuario = await this.usuarioRepo.findOne({
      where: { email: userEmail },
    });
    alerta.estado = EstadoAlerta.RESUELTA;
    alerta.fechaResuelta = new Date();
    alerta.resueltaPorId = usuario?.id ?? null;

    return this.alertaRepo.save(alerta);
  }

  async descartar(id: number, comunidadId: number): Promise<Alerta> {
    const alerta = await this.alertaRepo.findOne({ where: { id } });
    if (!alerta) throw new ResourceNotFoundException('Alerta', id);
    if (alerta.comunidadId !== Number(comunidadId)) {
      throw new ResourceNotFoundException('Alerta', id);
    }
    alerta.estado = EstadoAlerta.DESCARTADA;
    return this.alertaRepo.save(alerta);
  }
}
