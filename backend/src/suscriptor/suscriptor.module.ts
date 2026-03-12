import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Suscriptor, Comunidad } from '../common/entities';
import { SuscriptorService } from './suscriptor.service';
import { SuscriptorController } from './suscriptor.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Suscriptor, Comunidad])],
  controllers: [SuscriptorController],
  providers: [SuscriptorService],
  exports: [SuscriptorService],
})
export class SuscriptorModule {}
