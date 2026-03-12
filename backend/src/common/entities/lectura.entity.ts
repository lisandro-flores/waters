import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Unique,
} from 'typeorm';
import { Medidor } from './medidor.entity';
import { Usuario } from './usuario.entity';

@Entity('lecturas')
@Unique(['medidorId', 'anio', 'mes'])
export class Lectura {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id!: number;

  @Column({ name: 'medidor_id', type: 'bigint' })
  medidorId!: number;

  @ManyToOne(() => Medidor, { eager: true })
  @JoinColumn({ name: 'medidor_id' })
  medidor!: Medidor;

  @Column({ type: 'int' })
  anio!: number;

  @Column({ type: 'int' })
  mes!: number;

  @Column({ name: 'lectura_anterior', type: 'double precision' })
  lecturaAnterior!: number;

  @Column({ name: 'lectura_actual', type: 'double precision' })
  lecturaActual!: number;

  @Column({ name: 'consumom3', type: 'double precision' })
  consumoM3!: number;

  @Column({ name: 'fecha_lectura', type: 'date', nullable: true })
  fechaLectura!: string | null;

  @Column({ name: 'lector_id', type: 'bigint', nullable: true })
  lectorId!: number | null;

  @ManyToOne(() => Usuario, { nullable: true, eager: false })
  @JoinColumn({ name: 'lector_id' })
  lector!: Usuario | null;

  @Column({ type: 'text', nullable: true })
  observaciones!: string | null;

  @Column({ type: 'boolean', default: false })
  estimada!: boolean;

  @CreateDateColumn({ name: 'creado_en' })
  creadoEn!: Date;
}
