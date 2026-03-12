import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Lectura, Medidor } from '../common/entities';
import { LecturaService } from './lectura.service';
import { LecturaController } from './lectura.controller';
import { AlertaModule } from '../alerta/alerta.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Lectura, Medidor]),
    forwardRef(() => AlertaModule),
  ],
  controllers: [LecturaController],
  providers: [LecturaService],
  exports: [LecturaService],
})
export class LecturaModule {}
