import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';
import env from './config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(env.port);
}
bootstrap();
