import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Medidor, Suscriptor } from '../common/entities';
import { EstadoMedidor } from '../common/enums';
import { MedidorRequest } from './dto/medidor.dto';
import {
  BusinessException,
  ResourceNotFoundException,
} from '../common/exceptions';

@Injectable()
export class MedidorService {
  constructor(
    @InjectRepository(Medidor)
    private readonly repo: Repository<Medidor>,
    @InjectRepository(Suscriptor)
    private readonly suscriptorRepo: Repository<Suscriptor>,
  ) {}

  async getPorSuscriptor(suscriptorId: number): Promise<Medidor[]> {
    return this.repo.find({ where: { suscriptorId } });
  }

  async getPorComunidadYEstado(
    comunidadId: number,
    estado: EstadoMedidor,
  ): Promise<Medidor[]> {
    return this.repo
      .createQueryBuilder('m')
      .innerJoinAndSelect('m.suscriptor', 's')
      .where('s.comunidad_id = :comunidadId', { comunidadId })
      .andWhere('m.estado = :estado', { estado })
      .getMany();
  }

  async obtenerPorId(id: number, comunidadId: number): Promise<Medidor> {
    const medidor = await this.repo.findOne({
      where: { id },
      relations: ['suscriptor', 'suscriptor.comunidad'],
    });
    if (!medidor) throw new ResourceNotFoundException('Medidor', id);
    if (medidor.suscriptor.comunidadId !== Number(comunidadId)) {
      throw new ResourceNotFoundException('Medidor', id);
    }
    return medidor;
  }

  async crear(dto: MedidorRequest, comunidadId: number): Promise<Medidor> {
    const suscriptor = await this.suscriptorRepo.findOne({
      where: { id: dto.suscriptorId },
    });
    if (!suscriptor)
      throw new ResourceNotFoundException('Suscriptor', dto.suscriptorId);
    if (suscriptor.comunidadId !== Number(comunidadId)) {
      throw new ResourceNotFoundException('Suscriptor', dto.suscriptorId);
    }

    const existe = await this.repo.findOne({
      where: { numeroSerie: dto.numeroSerie },
    });
    if (existe) {
      throw new BusinessException(
        'Ya existe un medidor con serie: ' + dto.numeroSerie,
      );
    }

    const medidor = this.repo.create({
      numeroSerie: dto.numeroSerie,
      marca: dto.marca ?? null,
      diametro: dto.diametro ?? null,
      lecturaInicial: dto.lecturaInicial ?? 0,
      estado: dto.estado ?? EstadoMedidor.ACTIVO,
      fechaInstalacion:
        dto.fechaInstalacion ?? new Date().toISOString().split('T')[0],
      suscriptorId: dto.suscriptorId,
    });
    return this.repo.save(medidor);
  }

  async actualizar(
    id: number,
    dto: MedidorRequest,
    comunidadId: number,
  ): Promise<Medidor> {
    const medidor = await this.obtenerPorId(id, comunidadId);
    medidor.numeroSerie = dto.numeroSerie;
    medidor.marca = dto.marca ?? null;
    medidor.diametro = dto.diametro ?? null;
    medidor.estado = dto.estado ?? medidor.estado;

    if (dto.suscriptorId && dto.suscriptorId !== medidor.suscriptorId) {
      const nuevoSuscriptor = await this.suscriptorRepo.findOne({
        where: { id: dto.suscriptorId },
      });
      if (!nuevoSuscriptor)
        throw new ResourceNotFoundException('Suscriptor', dto.suscriptorId);
      medidor.suscriptorId = dto.suscriptorId;
    }

    return this.repo.save(medidor);
  }

  async darDeBaja(id: number, comunidadId: number): Promise<Medidor> {
    const medidor = await this.obtenerPorId(id, comunidadId);
    medidor.estado = EstadoMedidor.RETIRADO;
    medidor.fechaBaja = new Date().toISOString().split('T')[0];
    return this.repo.save(medidor);
  }
}
