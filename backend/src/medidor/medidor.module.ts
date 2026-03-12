import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Medidor, Suscriptor } from '../common/entities';
import { MedidorService } from './medidor.service';
import { MedidorController } from './medidor.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Medidor, Suscriptor])],
  controllers: [MedidorController],
  providers: [MedidorService],
  exports: [MedidorService],
})
export class MedidorModule {}
