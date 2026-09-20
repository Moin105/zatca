import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

function buildCorsOrigins(): string[] | boolean {
  const fromList = (process.env.FRONTEND_URLS || '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);

  const single = process.env.FRONTEND_URL?.trim();

  const defaults = [
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    'https://portal.clockchair.com',
  ];

  const origins = Array.from(
    new Set([...defaults, ...fromList, ...(single ? [single] : [])]),
  );

  return origins;
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const allowedOrigins = buildCorsOrigins();

  app.enableCors({
    origin: (
      origin: string | undefined,
      callback: (err: Error | null, allow?: boolean) => void,
    ) => {
      // Allow non-browser / same-origin tools (no Origin header)
      if (!origin) {
        callback(null, true);
        return;
      }
      if (Array.isArray(allowedOrigins) && allowedOrigins.includes(origin)) {
        callback(null, true);
        return;
      }
      callback(new Error(`CORS blocked for origin: ${origin}`), false);
    },
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const port = process.env.PORT || 3001;
  await app.listen(port);
  console.log(`🚀 Backend server running on http://localhost:${port}`);
}

bootstrap();
