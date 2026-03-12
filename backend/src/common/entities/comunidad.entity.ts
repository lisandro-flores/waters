import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';

@Entity('comunidades')
export class Comunidad {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id!: number;

  @Column({ type: 'varchar', length: 100, unique: true })
  nombre!: string;

  @Column({ type: 'varchar', length: 200, nullable: true })
  direccion!: string | null;

  @Column({ type: 'varchar', length: 20, nullable: true })
  telefono!: string | null;

  @Column({ type: 'varchar', length: 100, nullable: true })
  email!: string | null;

  @Column({ type: 'varchar', length: 20, nullable: true })
  ruc!: string | null;

  @Column({ type: 'varchar', length: 80, nullable: true })
  provincia!: string | null;

  @Column({ type: 'varchar', length: 80, nullable: true })
  municipio!: string | null;

  @Column({ type: 'boolean', default: true })
  activo!: boolean;

  @CreateDateColumn({ name: 'creado_en' })
  creadoEn!: Date;

  @UpdateDateColumn({ name: 'actualizado_en' })
  actualizadoEn!: Date;

  @OneToMany('Usuario', 'comunidad')
  usuarios?: any[];

  @OneToMany('Suscriptor', 'comunidad')
  suscriptores?: any[];

  @OneToMany('Tarifa', 'comunidad')
  tarifas?: any[];
}
