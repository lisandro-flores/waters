import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Tarifa } from './tarifa.entity';

@Entity('tarifa_rangos')
export class TarifaRango {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id!: number;

  @Column({ name: 'tarifa_id', type: 'bigint' })
  tarifaId!: number;

  @ManyToOne(() => Tarifa, (t) => t.rangos, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'tarifa_id' })
  tarifa!: Tarifa;

  @Column({ name: 'rango_desde', type: 'double precision' })
  rangoDesde!: number;

  @Column({ name: 'rango_hasta', type: 'double precision', nullable: true })
  rangoHasta!: number | null;

  @Column({ name: 'precio_porm3', type: 'numeric', precision: 10, scale: 4 })
  precioPorM3!: string;
}
