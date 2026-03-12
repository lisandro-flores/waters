import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Factura, Pago, Suscriptor } from '../common/entities';
import { ReporteService } from './reporte.service';
import { ReporteController } from './reporte.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Factura, Pago, Suscriptor])],
  controllers: [ReporteController],
  providers: [ReporteService],
  exports: [ReporteService],
})
export class ReporteModule {}
