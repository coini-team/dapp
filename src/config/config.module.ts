// Third Party Dependencies.
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';

// Local Dependencies.
import { ConfigService } from './config.service';
import smtConfig from './smt.config';

// Configuración de las rutas de los archivos .env
const envsConfig = {
  // Ejemplo:
  // production: '.env.prod',
  development: '.env.development',
  // test: '.env.test',
};

/**
 * @fileOverview Config Module.
 *
 * This module is responsible for providing the Config Service.
 *
 * @module ConfigModule
 */
@Module({
  imports: [
    NestConfigModule.forRoot({
      envFilePath: envsConfig[process.env.NODE_ENV] || '.env.development',
      load: [smtConfig],
      isGlobal: true,
    }),
  ],
  providers: [
    // Provide the Config Service.
    {
      provide: ConfigService,
      useValue: new ConfigService(),
    },
  ],
  exports: [ConfigService],
})
export class ConfigModule {}
