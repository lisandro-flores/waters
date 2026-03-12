import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comunidad } from '../common/entities';
import { ComunidadRequest } from './dto/comunidad.dto';
import {
  BusinessException,
  ResourceNotFoundException,
} from '../common/exceptions';

@Injectable()
export class ComunidadService {
  constructor(
    @InjectRepository(Comunidad)
    private readonly repo: Repository<Comunidad>,
  ) {}

  async listarActivas(): Promise<Comunidad[]> {
    return this.repo.find({ where: { activo: true } });
  }

  async obtenerPorId(id: number): Promise<Comunidad> {
    const comunidad = await this.repo.findOne({ where: { id } });
    if (!comunidad) throw new ResourceNotFoundException('Comunidad', id);
    return comunidad;
  }

  async crear(dto: ComunidadRequest): Promise<Comunidad> {
    const existe = await this.repo.findOne({
      where: { nombre: dto.nombre },
    });
    if (existe) {
      throw new BusinessException(
        'Ya existe una comunidad con el nombre: ' + dto.nombre,
      );
    }
    const comunidad = this.repo.create({
      nombre: dto.nombre,
      direccion: dto.direccion ?? null,
      telefono: dto.telefono ?? null,
      email: dto.email ?? null,
      ruc: dto.ruc ?? null,
      provincia: dto.provincia ?? null,
      municipio: dto.municipio ?? null,
      activo: true,
    });
    return this.repo.save(comunidad);
  }

  async actualizar(id: number, dto: ComunidadRequest): Promise<Comunidad> {
    const comunidad = await this.obtenerPorId(id);
    comunidad.nombre = dto.nombre;
    comunidad.direccion = dto.direccion ?? null;
    comunidad.telefono = dto.telefono ?? null;
    comunidad.email = dto.email ?? null;
    comunidad.ruc = dto.ruc ?? null;
    comunidad.provincia = dto.provincia ?? null;
    comunidad.municipio = dto.municipio ?? null;
    return this.repo.save(comunidad);
  }

  async desactivar(id: number): Promise<void> {
    const comunidad = await this.obtenerPorId(id);
    comunidad.activo = false;
    await this.repo.save(comunidad);
  }
}
