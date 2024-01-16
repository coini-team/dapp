// Third Party Dependencies
import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import * as dotenv from 'dotenv';
dotenv.config();

// Local Dependencies
import { AppModule } from './app.module';

async function bootstrap() {
  // Logger junto con los ms
  const logger = new Logger('NestApplication', { timestamp: true });
  // Init NestJS app and set global prefix.
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');

  const port = AppModule.port;
  await app.listen(port, () => {
    // Logger junto con los ms
    logger.log(`Server running on http://localhost:${port}`);
  });
}
bootstrap();
