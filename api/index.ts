import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { ExpressAdapter } from '@nestjs/platform-express';
import express from 'express';

const expressApp = express();
let cachedHandler: express.Express | null = null;

async function bootstrap(): Promise<express.Express> {
  if (!cachedHandler) {
    const app = await NestFactory.create(
      AppModule,
      new ExpressAdapter(expressApp),
    );
    app.enableCors();
    await app.init();
    cachedHandler = expressApp;
  }
  return cachedHandler;
}

export default async function handler(
  req: express.Request,
  res: express.Response,
) {
  const app = await bootstrap();
  app(req, res);
}
