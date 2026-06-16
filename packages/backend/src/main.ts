import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { IoAdapter } from '@nestjs/platform-socket.io';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, new IoAdapter());
  const configService = app.get(ConfigService);

  app.enableCors({
    origin: (
      origin: string | undefined,
      callback: (err: Error | null, allow?: boolean) => void,
    ) => {
      const allowed = configService.get<string>('ALLOWED_ORIGINS') ?? '';
      const isAllowed =
        !origin ||
        allowed
          .split(',')
          .map((item) => item.trim())
          .filter(Boolean)
          .includes(origin);

      callback(null, isAllowed);
    },
    credentials: true,
  });

  const swaggerPath = configService.get<string>('SWAGGER_PATH') ?? 'docs';
  const appName = configService.get<string>('APP_NAME') ?? 'Learning API';
  const appDescription =
    configService.get<string>('APP_DESCRIPTION') ??
    'API documentation for the trucking platform';
  const appVersion = configService.get<string>('APP_VERSION') ?? '1.0';

  const config = new DocumentBuilder()
    .setTitle(appName)
    .setDescription(appDescription)
    .setVersion(appVersion)
    .addTag('auth')
    .addTag('users')
    .addTag('organizations')
    .addTag('drivers')
    .addTag('vehicles')
    .addTag('loads')
    .addTag('dispatches')
    .addTag('tracking')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(swaggerPath, app, document);

  await app.listen(configService.get<number>('APP_PORT') ?? 3000);
}
void bootstrap().catch((error: unknown) => {
  console.error(error);
  process.exit(1);
});
