import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AlertaService } from './alerta.service';
import { AlertaController } from './alerta.controller';
import { Alerta, Comunidad, Lectura, Medidor, Usuario } from '../common/entities';

@Module({
  imports: [
    TypeOrmModule.forFeature([Alerta, Comunidad, Lectura, Medidor, Usuario]),
  ],
  controllers: [AlertaController],
  providers: [AlertaService],
  exports: [AlertaService],
})
export class AlertaModule {}
