import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { MetodoPago } from '../enums';
import { Factura } from './factura.entity';
import { Usuario } from './usuario.entity';

@Entity('pagos')
export class Pago {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id!: number;

  @Column({ name: 'factura_id', type: 'bigint' })
  facturaId!: number;

  @ManyToOne(() => Factura, { eager: true })
  @JoinColumn({ name: 'factura_id' })
  factura!: Factura;

  @Column({ type: 'numeric', precision: 10, scale: 2 })
  monto!: string;

  @Column({ name: 'fecha_pago', type: 'date', nullable: true })
  fechaPago!: string | null;

  @Column({
    name: 'metodo_pago',
    type: 'varchar',
    enum: MetodoPago,
    default: MetodoPago.EFECTIVO,
  })
  metodoPago!: MetodoPago;

  @Column({ type: 'varchar', length: 60, nullable: true })
  referencia!: string | null;

  @Column({ name: 'cajero_id', type: 'bigint', nullable: true })
  cajeroId!: number | null;

  @ManyToOne(() => Usuario, { nullable: true, eager: false })
  @JoinColumn({ name: 'cajero_id' })
  cajero!: Usuario | null;

  @Column({ type: 'text', nullable: true })
  observaciones!: string | null;

  @CreateDateColumn({ name: 'creado_en' })
  creadoEn!: Date;
}
