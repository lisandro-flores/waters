import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Factura, Lectura, Tarifa } from '../common/entities';
import { FacturacionService } from './facturacion.service';
import { FacturacionController } from './facturacion.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Factura, Lectura, Tarifa])],
  controllers: [FacturacionController],
  providers: [FacturacionService],
  exports: [FacturacionService],
})
export class FacturacionModule {}
