import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Unique,
} from 'typeorm';
import { RolUsuario } from '../enums';
import { Comunidad } from './comunidad.entity';
import { Exclude } from 'class-transformer';

@Entity('usuarios')
@Unique(['email', 'comunidadId'])
export class Usuario {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id!: number;

  @Column({ type: 'varchar', length: 100 })
  nombre!: string;

  @Column({ type: 'varchar', length: 100 })
  apellido!: string;

  @Column({ type: 'varchar', length: 150 })
  email!: string;

  @Exclude()
  @Column({ type: 'varchar', length: 255 })
  password!: string;

  @Column({ type: 'varchar', enum: RolUsuario })
  rol!: RolUsuario;

  @Column({ type: 'varchar', length: 20, nullable: true })
  telefono!: string | null;

  @Column({ type: 'boolean', default: true })
  activo!: boolean;

  @Column({ name: 'comunidad_id', type: 'bigint' })
  comunidadId!: number;

  @ManyToOne(() => Comunidad, { lazy: true })
  @JoinColumn({ name: 'comunidad_id' })
  comunidad!: Comunidad;

  @CreateDateColumn({ name: 'creado_en' })
  creadoEn!: Date;

  @UpdateDateColumn({ name: 'actualizado_en' })
  actualizadoEn!: Date;

  get nombreCompleto(): string {
    return `${this.nombre} ${this.apellido}`;
  }
}
