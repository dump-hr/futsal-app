import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { PrismaClientExceptionFilter } from './prisma-client-exception.filter';

const setupFilter = (app: INestApplication) => {
  const { httpAdapter } = app.get(HttpAdapterHost);
  app.useGlobalFilters(new PrismaClientExceptionFilter(httpAdapter));
};

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.setGlobalPrefix('api');
  app.set('trust proxy', 1);

  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  setupFilter(app);

  await app.listen(process.env.PORT ?? 3000);
}

void bootstrap();
