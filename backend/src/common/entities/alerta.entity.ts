import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { EstadoAlerta, TipoAlerta } from '../enums';
import { Suscriptor } from './suscriptor.entity';
import { Comunidad } from './comunidad.entity';
import { Usuario } from './usuario.entity';

@Entity('alertas')
export class Alerta {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id!: number;

  @Column({ type: 'varchar', enum: TipoAlerta })
  tipo!: TipoAlerta;

  @Column({ type: 'varchar', length: 200 })
  mensaje!: string;

  @Column({ name: 'suscriptor_id', type: 'bigint', nullable: true })
  suscriptorId!: number | null;

  @ManyToOne(() => Suscriptor, { nullable: true, eager: true })
  @JoinColumn({ name: 'suscriptor_id' })
  suscriptor!: Suscriptor | null;

  @Column({ name: 'comunidad_id', type: 'bigint' })
  comunidadId!: number;

  @ManyToOne(() => Comunidad, { eager: true })
  @JoinColumn({ name: 'comunidad_id' })
  comunidad!: Comunidad;

  @Column({ type: 'varchar', enum: EstadoAlerta, default: EstadoAlerta.PENDIENTE })
  estado!: EstadoAlerta;

  @Column({ name: 'fecha_resuelta', type: 'timestamp', nullable: true })
  fechaResuelta!: Date | null;

  @Column({ name: 'resuelta_por_id', type: 'bigint', nullable: true })
  resueltaPorId!: number | null;

  @ManyToOne(() => Usuario, { nullable: true, eager: false })
  @JoinColumn({ name: 'resuelta_por_id' })
  resueltaPor!: Usuario | null;

  @CreateDateColumn({ name: 'creado_en' })
  creadoEn!: Date;
}
