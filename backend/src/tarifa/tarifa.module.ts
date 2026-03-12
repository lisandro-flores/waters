import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tarifa, TarifaRango, Comunidad } from '../common/entities';
import { TarifaService } from './tarifa.service';
import { TarifaController } from './tarifa.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Tarifa, TarifaRango, Comunidad])],
  controllers: [TarifaController],
  providers: [TarifaService],
  exports: [TarifaService],
})
export class TarifaModule {}
