import { NestFactory } from '@nestjs/core';
import { S3Client, CreateBucketCommand } from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { IoAdapter } from '@nestjs/platform-socket.io';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, new IoAdapter());
  const configService = app.get(ConfigService);

  // Initialize S3 bucket for LocalStack
  const s3Endpoint = configService.get<string>('S3_ENDPOINT');
  const bucketName = configService.get<string>('AWS_S3_BUCKET');
  if (s3Endpoint && bucketName) {
    try {
      const s3 = new S3Client({
        region: configService.get<string>('AWS_REGION') ?? 'us-east-1',
        endpoint: s3Endpoint,
        credentials: {
          accessKeyId: configService.get<string>('AWS_ACCESS_KEY_ID') ?? 'test',
          secretAccessKey:
            configService.get<string>('AWS_SECRET_ACCESS_KEY') ?? 'test',
        },
        forcePathStyle: true,
      });
      await s3.send(
        new CreateBucketCommand({ Bucket: bucketName }),
      ).catch(() => {
        // Bucket may already exist, ignore error
      });
    } catch {
      // S3 initialization is optional
    }
  }

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