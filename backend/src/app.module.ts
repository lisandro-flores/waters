import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { AuthModule } from './auth/auth.module';
import { ComunidadModule } from './comunidad/comunidad.module';
import { SuscriptorModule } from './suscriptor/suscriptor.module';
import { MedidorModule } from './medidor/medidor.module';
import { LecturaModule } from './lectura/lectura.module';
import { TarifaModule } from './tarifa/tarifa.module';
import { FacturacionModule } from './facturacion/facturacion.module';
import { PagoModule } from './pago/pago.module';
import { ReporteModule } from './reporte/reporte.module';
import { AlertaModule } from './alerta/alerta.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5433', 10),
      username: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASS || 'postgres',
      database: process.env.DB_NAME || 'agua_potable',
      autoLoadEntities: true,
      synchronize: false,
      logging: process.env.NODE_ENV !== 'production',
    }),
    ScheduleModule.forRoot(),
    AuthModule,
    ComunidadModule,
    SuscriptorModule,
    MedidorModule,
    LecturaModule,
    TarifaModule,
    FacturacionModule,
    PagoModule,
    ReporteModule,
    AlertaModule,
  ],
})
export class AppModule {}
