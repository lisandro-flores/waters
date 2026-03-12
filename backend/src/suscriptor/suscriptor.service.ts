import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import { Suscriptor, Comunidad } from '../common/entities';
import { EstadoSuscriptor } from '../common/enums';
import { SuscriptorRequest } from './dto/suscriptor.dto';
import {
  BusinessException,
  ResourceNotFoundException,
} from '../common/exceptions';

@Injectable()
export class SuscriptorService {
  constructor(
    @InjectRepository(Suscriptor)
    private readonly repo: Repository<Suscriptor>,
    @InjectRepository(Comunidad)
    private readonly comunidadRepo: Repository<Comunidad>,
  ) {}

  async listar(
    comunidadId: number,
    query: string | undefined,
    page: number,
    size: number,
  ) {
    const skip = page * size;

    if (query && query.trim()) {
      const q = `%${query}%`;
      const [data, total] = await this.repo
        .createQueryBuilder('s')
        .where('s.comunidad_id = :comunidadId', { comunidadId })
        .andWhere(
          '(LOWER(s.nombre) LIKE LOWER(:q) OR LOWER(s.apellido) LIKE LOWER(:q) OR LOWER(s.numero_cuenta) LIKE LOWER(:q))',
          { q },
        )
        .orderBy('s.numero_cuenta', 'ASC')
        .skip(skip)
        .take(size)
        .getManyAndCount();
      return {
        content: data,
        totalElements: total,
        totalPages: Math.ceil(total / size),
        size,
        number: page,
      };
    }

    const [data, total] = await this.repo.findAndCount({
      where: { comunidadId },
      order: { numeroCuenta: 'ASC' },
      skip,
      take: size,
    });

    return {
      content: data,
      totalElements: total,
      totalPages: Math.ceil(total / size),
      size,
      number: page,
    };
  }

  async obtenerPorId(id: number, comunidadId: number): Promise<Suscriptor> {
    const suscriptor = await this.repo.findOne({ where: { id } });
    if (!suscriptor) throw new ResourceNotFoundException('Suscriptor', id);
    if (suscriptor.comunidadId !== Number(comunidadId)) {
      throw new ResourceNotFoundException('Suscriptor', id);
    }
    return suscriptor;
  }

  async crear(
    dto: SuscriptorRequest,
    comunidadId: number,
  ): Promise<Suscriptor> {
    const comunidad = await this.comunidadRepo.findOne({
      where: { id: comunidadId },
    });
    if (!comunidad)
      throw new ResourceNotFoundException('Comunidad', comunidadId);

    const existe = await this.repo.findOne({
      where: { numeroCuenta: dto.numeroCuenta, comunidadId },
    });
    if (existe) {
      throw new BusinessException(
        'Ya existe un suscriptor con la cuenta: ' + dto.numeroCuenta,
      );
    }

    const suscriptor = this.repo.create({
      numeroCuenta: dto.numeroCuenta,
      nombre: dto.nombre,
      apellido: dto.apellido,
      identificacion: dto.identificacion ?? null,
      direccion: dto.direccion ?? null,
      telefono: dto.telefono ?? null,
      email: dto.email ?? null,
      tipo: dto.tipo,
      estado: dto.estado,
      fechaIngreso: new Date().toISOString().split('T')[0],
      comunidadId,
    });
    return this.repo.save(suscriptor);
  }

  async actualizar(
    id: number,
    dto: SuscriptorRequest,
    comunidadId: number,
  ): Promise<Suscriptor> {
    const suscriptor = await this.obtenerPorId(id, comunidadId);
    suscriptor.nombre = dto.nombre;
    suscriptor.apellido = dto.apellido;
    suscriptor.identificacion = dto.identificacion ?? null;
    suscriptor.direccion = dto.direccion ?? null;
    suscriptor.telefono = dto.telefono ?? null;
    suscriptor.email = dto.email ?? null;
    suscriptor.tipo = dto.tipo ?? suscriptor.tipo;
    suscriptor.estado = dto.estado ?? suscriptor.estado;
    return this.repo.save(suscriptor);
  }

  async contarActivos(comunidadId: number): Promise<number> {
    return this.repo.count({
      where: { comunidadId, estado: EstadoSuscriptor.ACTIVO },
    });
  }
}
