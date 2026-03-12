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
import { EstadoMedidor } from '../enums';
import { Suscriptor } from './suscriptor.entity';

@Entity('medidores')
export class Medidor {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id!: number;

  @Column({ name: 'numero_serie', type: 'varchar', length: 50, unique: true })
  numeroSerie!: string;

  @Column({ type: 'varchar', length: 80, nullable: true })
  marca!: string | null;

  @Column({ type: 'varchar', length: 10, nullable: true })
  diametro!: string | null;

  @Column({ name: 'lectura_inicial', type: 'double precision', default: 0 })
  lecturaInicial!: number;

  @Column({ type: 'varchar', enum: EstadoMedidor, default: EstadoMedidor.ACTIVO })
  estado!: EstadoMedidor;

  @Column({ name: 'fecha_instalacion', type: 'date', nullable: true })
  fechaInstalacion!: string | null;

  @Column({ name: 'fecha_baja', type: 'date', nullable: true })
  fechaBaja!: string | null;

  @Column({ name: 'suscriptor_id', type: 'bigint' })
  suscriptorId!: number;

  @ManyToOne(() => Suscriptor, { eager: true })
  @JoinColumn({ name: 'suscriptor_id' })
  suscriptor!: Suscriptor;

  @OneToMany('Lectura', 'medidor')
  lecturas?: any[];

  @CreateDateColumn({ name: 'creado_en' })
  creadoEn!: Date;

  @UpdateDateColumn({ name: 'actualizado_en' })
  actualizadoEn!: Date;
}
