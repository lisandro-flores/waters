import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tarifa, TarifaRango, Comunidad } from '../common/entities';
import { TarifaRequest } from './dto/tarifa.dto';
import { ResourceNotFoundException } from '../common/exceptions';

@Injectable()
export class TarifaService {
  constructor(
    @InjectRepository(Tarifa)
    private readonly repo: Repository<Tarifa>,
    @InjectRepository(Comunidad)
    private readonly comunidadRepo: Repository<Comunidad>,
    @InjectRepository(TarifaRango)
    private readonly rangoRepo: Repository<TarifaRango>,
  ) {}

  async listarActivas(comunidadId: number): Promise<Tarifa[]> {
    return this.repo.find({
      where: { comunidadId, activo: true },
      relations: ['rangos'],
    });
  }

  async obtenerPorId(id: number, comunidadId: number): Promise<Tarifa> {
    const tarifa = await this.repo.findOne({
      where: { id },
      relations: ['rangos'],
    });
    if (!tarifa) throw new ResourceNotFoundException('Tarifa', id);
    if (tarifa.comunidadId !== Number(comunidadId)) {
      throw new ResourceNotFoundException('Tarifa', id);
    }
    return tarifa;
  }

  async crear(dto: TarifaRequest, comunidadId: number): Promise<Tarifa> {
    const comunidad = await this.comunidadRepo.findOne({
      where: { id: comunidadId },
    });
    if (!comunidad)
      throw new ResourceNotFoundException('Comunidad', comunidadId);

    const tarifa = this.repo.create({
      nombre: dto.nombre,
      comunidadId,
      tipoSuscriptor: dto.tipoSuscriptor,
      cuotaFija: String(dto.cuotaFija),
      porcentajeMora: String(dto.porcentajeMora ?? 0.02),
      diasGracia: dto.diasGracia ?? 15,
      vigenciaDesde: dto.vigenciaDesde ?? null,
      vigenciaHasta: dto.vigenciaHasta ?? null,
      activo: true,
      rangos: [],
    });

    if (dto.rangos) {
      tarifa.rangos = dto.rangos.map((r) =>
        this.rangoRepo.create({
          rangoDesde: r.rangoDesde,
          rangoHasta: r.rangoHasta ?? null,
          precioPorM3: String(r.precioPorM3),
        }),
      );
    }

    return this.repo.save(tarifa);
  }

  async actualizar(
    id: number,
    dto: TarifaRequest,
    comunidadId: number,
  ): Promise<Tarifa> {
    const tarifa = await this.obtenerPorId(id, comunidadId);

    tarifa.nombre = dto.nombre;
    tarifa.tipoSuscriptor = dto.tipoSuscriptor;
    tarifa.cuotaFija = String(dto.cuotaFija);
    tarifa.porcentajeMora = String(dto.porcentajeMora ?? 0.02);
    tarifa.diasGracia = dto.diasGracia ?? 15;
    tarifa.vigenciaDesde = dto.vigenciaDesde ?? null;
    tarifa.vigenciaHasta = dto.vigenciaHasta ?? null;

    // Remove old rangos
    if (tarifa.rangos && tarifa.rangos.length > 0) {
      await this.rangoRepo.remove(tarifa.rangos);
    }

    tarifa.rangos = [];
    if (dto.rangos) {
      tarifa.rangos = dto.rangos.map((r) =>
        this.rangoRepo.create({
          rangoDesde: r.rangoDesde,
          rangoHasta: r.rangoHasta ?? null,
          precioPorM3: String(r.precioPorM3),
          tarifaId: tarifa.id,
        }),
      );
    }

    return this.repo.save(tarifa);
  }

  async desactivar(id: number, comunidadId: number): Promise<void> {
    const tarifa = await this.obtenerPorId(id, comunidadId);
    tarifa.activo = false;
    await this.repo.save(tarifa);
  }
}
