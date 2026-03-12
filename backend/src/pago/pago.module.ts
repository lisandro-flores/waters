import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Pago, Factura, Usuario } from '../common/entities';
import { PagoService } from './pago.service';
import { PagoController } from './pago.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Pago, Factura, Usuario])],
  controllers: [PagoController],
  providers: [PagoService],
  exports: [PagoService],
})
export class PagoModule {}
