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
import { EstadoSuscriptor, TipoSuscriptor } from '../enums';
import { Comunidad } from './comunidad.entity';

@Entity('suscriptores')
export class Suscriptor {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id!: number;

  @Column({ name: 'numero_cuenta', type: 'varchar', length: 20 })
  numeroCuenta!: string;

  @Column({ type: 'varchar', length: 100 })
  nombre!: string;

  @Column({ type: 'varchar', length: 100 })
  apellido!: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  identificacion!: string | null;

  @Column({ type: 'varchar', length: 200, nullable: true })
  direccion!: string | null;

  @Column({ type: 'varchar', length: 20, nullable: true })
  telefono!: string | null;

  @Column({ type: 'varchar', length: 150, nullable: true })
  email!: string | null;

  @Column({ type: 'varchar', enum: TipoSuscriptor, default: TipoSuscriptor.DOMICILIAR })
  tipo!: TipoSuscriptor;

  @Column({ type: 'varchar', enum: EstadoSuscriptor, default: EstadoSuscriptor.ACTIVO })
  estado!: EstadoSuscriptor;

  @Column({ name: 'fecha_ingreso', type: 'date', nullable: true })
  fechaIngreso!: string | null;

  @Column({ name: 'comunidad_id', type: 'bigint' })
  comunidadId!: number;

  @ManyToOne(() => Comunidad, { eager: true })
  @JoinColumn({ name: 'comunidad_id' })
  comunidad!: Comunidad;

  @OneToMany('Medidor', 'suscriptor')
  medidores?: any[];

  @OneToMany('Factura', 'suscriptor')
  facturas?: any[];

  @CreateDateColumn({ name: 'creado_en' })
  creadoEn!: Date;

  @UpdateDateColumn({ name: 'actualizado_en' })
  actualizadoEn!: Date;
}
