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
import { EstadoFactura } from '../enums';
import { Suscriptor } from './suscriptor.entity';
import { Lectura } from './lectura.entity';
import { Tarifa } from './tarifa.entity';

@Entity('facturas')
export class Factura {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id!: number;

  @Column({ name: 'numero_factura', type: 'varchar', length: 20 })
  numeroFactura!: string;

  @Column({ name: 'suscriptor_id', type: 'bigint' })
  suscriptorId!: number;

  @ManyToOne(() => Suscriptor, { eager: true })
  @JoinColumn({ name: 'suscriptor_id' })
  suscriptor!: Suscriptor;

  @Column({ name: 'lectura_id', type: 'bigint' })
  lecturaId!: number;

  @ManyToOne(() => Lectura, { eager: true })
  @JoinColumn({ name: 'lectura_id' })
  lectura!: Lectura;

  @Column({ name: 'tarifa_id', type: 'bigint' })
  tarifaId!: number;

  @ManyToOne(() => Tarifa, { eager: true })
  @JoinColumn({ name: 'tarifa_id' })
  tarifa!: Tarifa;

  @Column({ type: 'int' })
  anio!: number;

  @Column({ type: 'int' })
  mes!: number;

  @Column({ name: 'consumom3', type: 'double precision' })
  consumoM3!: number;

  @Column({ name: 'monto_base', type: 'numeric', precision: 10, scale: 2 })
  montoBase!: string;

  @Column({ name: 'monto_consumo', type: 'numeric', precision: 10, scale: 2 })
  montoConsumo!: string;

  @Column({ name: 'otros_cargos', type: 'numeric', precision: 10, scale: 2, default: 0 })
  otrosCargos!: string;

  @Column({ type: 'numeric', precision: 10, scale: 2, default: 0 })
  descuentos!: string;

  @Column({ type: 'numeric', precision: 10, scale: 2, default: 0 })
  mora!: string;

  @Column({ name: 'total_pagar', type: 'numeric', precision: 10, scale: 2 })
  totalPagar!: string;

  @Column({ name: 'fecha_emision', type: 'date', nullable: true })
  fechaEmision!: string | null;

  @Column({ name: 'fecha_vencimiento', type: 'date', nullable: true })
  fechaVencimiento!: string | null;

  @Column({ type: 'varchar', enum: EstadoFactura, default: EstadoFactura.PENDIENTE })
  estado!: EstadoFactura;

  @OneToMany('Pago', 'factura')
  pagos?: any[];

  @CreateDateColumn({ name: 'creado_en' })
  creadoEn!: Date;

  @UpdateDateColumn({ name: 'actualizado_en' })
  actualizadoEn!: Date;
}
