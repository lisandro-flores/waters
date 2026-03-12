import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Lectura, Medidor } from '../common/entities';
import { LecturaRequest } from './dto/lectura.dto';
import {
  BusinessException,
  ResourceNotFoundException,
} from '../common/exceptions';
import { AlertaService } from '../alerta/alerta.service';

@Injectable()
export class LecturaService {
  private readonly logger = new Logger(LecturaService.name);

  constructor(
    @InjectRepository(Lectura)
    private readonly repo: Repository<Lectura>,
    @InjectRepository(Medidor)
    private readonly medidorRepo: Repository<Medidor>,
    private readonly alertaService: AlertaService,
  ) {}

  async getPorMedidor(medidorId: number): Promise<Lectura[]> {
    return this.repo.find({
      where: { medidorId },
      order: { anio: 'DESC', mes: 'DESC' },
    });
  }

  async getPorPeriodo(
    comunidadId: number,
    anio: number,
    mes: number,
  ): Promise<Lectura[]> {
    return this.repo
      .createQueryBuilder('l')
      .innerJoinAndSelect('l.medidor', 'm')
      .innerJoin('m.suscriptor', 's')
      .where('s.comunidad_id = :comunidadId', { comunidadId })
      .andWhere('l.anio = :anio', { anio })
      .andWhere('l.mes = :mes', { mes })
      .getMany();
  }

  async registrar(dto: LecturaRequest, comunidadId: number): Promise<Lectura> {
    const medidor = await this.medidorRepo.findOne({
      where: { id: dto.medidorId },
      relations: ['suscriptor'],
    });
    if (!medidor)
      throw new ResourceNotFoundException('Medidor', dto.medidorId);
    if (medidor.suscriptor.comunidadId !== Number(comunidadId)) {
      throw new ResourceNotFoundException('Medidor', dto.medidorId);
    }

    if (dto.lecturaActual < dto.lecturaAnterior) {
      throw new BusinessException(
        'La lectura actual no puede ser menor que la anterior',
      );
    }

    const fechaStr =
      dto.fechaLectura || new Date().toISOString().split('T')[0];
    const fecha = new Date(fechaStr);
    const anio = fecha.getFullYear();
    const mes = fecha.getMonth() + 1;

    const existe = await this.repo.findOne({
      where: { medidorId: dto.medidorId, anio, mes },
    });
    if (existe) {
      throw new BusinessException(
        `Ya existe una lectura para el medidor en ${anio}/${mes}`,
      );
    }

    const consumo = dto.lecturaActual - dto.lecturaAnterior;

    const lectura = this.repo.create({
      medidorId: dto.medidorId,
      anio,
      mes,
      lecturaAnterior: dto.lecturaAnterior,
      lecturaActual: dto.lecturaActual,
      consumoM3: consumo,
      fechaLectura: fechaStr,
      observaciones: dto.observaciones ?? null,
      estimada: dto.estimada ?? false,
    });

    const saved = await this.repo.save(lectura);

    try {
      await this.alertaService.detectarConsumoAnomalo(saved);
    } catch (e: any) {
      this.logger.warn('Error al detectar consumo anómalo: ' + e.message);
    }

    return saved;
  }
}
