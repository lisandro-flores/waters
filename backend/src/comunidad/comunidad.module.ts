import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comunidad } from '../common/entities';
import { ComunidadService } from './comunidad.service';
import { ComunidadController } from './comunidad.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Comunidad])],
  controllers: [ComunidadController],
  providers: [ComunidadService],
  exports: [ComunidadService],
})
export class ComunidadModule {}
