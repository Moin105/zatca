import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { json, urlencoded } from 'express';
import { AppModule } from './app.module';

function buildCorsOrigins(): string[] {
  const fromEnv = [
    ...(process.env.FRONTEND_URLS || '').split(','),
    ...(process.env.FRONTEND_URL || '').split(','),
  ]
    .map((origin) => origin.trim())
    .filter(Boolean);

  const defaults = [
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    'https://portal.clockchair.com',
  ];

  return Array.from(new Set([...defaults, ...fromEnv]));
}

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    bodyParser: false,
  });
  app.use(json({ limit: '5mb' }));
  app.use(urlencoded({ extended: true, limit: '5mb' }));

  const allowedOrigins = buildCorsOrigins();

  // Allow portal.clockchair.com + localhost by default; extend via FRONTEND_URL(S).
  app.enableCors({
    origin: allowedOrigins,
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const port = Number(process.env.PORT) || 3001;
  // Railway proxy requires binding 0.0.0.0 (not localhost) or public URL returns 502.
  await app.listen(port, '0.0.0.0');
  console.log(`🚀 Backend server running on http://0.0.0.0:${port}`);
  console.log(`CORS origins: ${allowedOrigins.join(', ')}`);
}

bootstrap();
