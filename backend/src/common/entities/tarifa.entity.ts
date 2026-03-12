import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { TipoSuscriptor } from '../enums';
import { Comunidad } from './comunidad.entity';
import { TarifaRango } from './tarifa-rango.entity';

@Entity('tarifas')
export class Tarifa {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id!: number;

  @Column({ type: 'varchar', length: 100 })
  nombre!: string;

  @Column({ name: 'comunidad_id', type: 'bigint' })
  comunidadId!: number;

  @ManyToOne(() => Comunidad, { eager: true })
  @JoinColumn({ name: 'comunidad_id' })
  comunidad!: Comunidad;

  @Column({ name: 'tipo_suscriptor', type: 'varchar', enum: TipoSuscriptor })
  tipoSuscriptor!: TipoSuscriptor;

  @Column({ name: 'cuota_fija', type: 'numeric', precision: 10, scale: 2 })
  cuotaFija!: string;

  @Column({
    name: 'porcentaje_mora',
    type: 'numeric',
    precision: 5,
    scale: 4,
    default: '0.0200',
  })
  porcentajeMora!: string;

  @Column({ name: 'dias_gracia', type: 'int', default: 15 })
  diasGracia!: number;

  @Column({ name: 'vigencia_desde', type: 'date', nullable: true })
  vigenciaDesde!: string | null;

  @Column({ name: 'vigencia_hasta', type: 'date', nullable: true })
  vigenciaHasta!: string | null;

  @Column({ type: 'boolean', default: true })
  activo!: boolean;

  @OneToMany(() => TarifaRango, (r) => r.tarifa, {
    cascade: true,
    eager: true,
    orphanedRowAction: 'delete',
  })
  rangos!: TarifaRango[];

  @CreateDateColumn({ name: 'creado_en' })
  creadoEn!: Date;

  @UpdateDateColumn({ name: 'actualizado_en' })
  actualizadoEn!: Date;
}
