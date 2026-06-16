import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { randomUUID } from 'crypto';
import { extname } from 'path';
import { CreatePresignedUploadDto } from './dto/create-presigned-upload.dto';

const allowedImageContentTypes = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/svg+xml',
  'image/avif',
]);

@Injectable()
export class UploadService {
  private readonly s3: S3Client;

  constructor(private readonly configService: ConfigService) {
    this.s3 = new S3Client({
      region: this.configService.get<string>('AWS_REGION') ?? 'us-east-1',
      endpoint: this.configService.get<string>('S3_ENDPOINT'),
      credentials: {
        accessKeyId:
          this.configService.get<string>('AWS_ACCESS_KEY_ID') ?? 'test',
        secretAccessKey:
          this.configService.get<string>('AWS_SECRET_ACCESS_KEY') ?? 'test',
      },
      forcePathStyle: true,
    });
  }

  async createPresignedUpload(dto: CreatePresignedUploadDto) {
    const bucket = this.requiredConfig('AWS_S3_BUCKET');
    const contentType = this.normalizeContentType(dto.contentType);
    if (!allowedImageContentTypes.has(contentType)) {
      throw new BadRequestException('Only image files are supported');
    }

    const key = this.buildKey(dto.kind, dto.fileName);
    const putUrl = await getSignedUrl(
      this.s3,
      new PutObjectCommand({
        Bucket: bucket,
        Key: key,
        ContentType: contentType,
      }),
      { expiresIn: 300 },
    );

    return {
      url: putUrl,
      key,
      publicUrl: this.publicUrlFor(bucket, key),
      contentType,
    };
  }

  private publicUrlFor(bucket: string, key: string) {
    const publicBucketUrl = this.configService.get<string>('S3_PUBLIC_URL');
    if (publicBucketUrl) {
      const base = publicBucketUrl.replace(/\/$/, '');
      return `${base}/${this.encodeKey(key)}`;
    }

    return getSignedUrl(
      this.s3,
      new GetObjectCommand({ Bucket: bucket, Key: key }),
      { expiresIn: 3600 },
    );
  }

  private buildKey(kind: CreatePresignedUploadDto['kind'], fileName: string) {
    const safeName = this.safeFileName(fileName);
    const extension = extname(safeName) || '.bin';
    const date = new Date().toISOString().slice(0, 10);
    return `uploads/${kind}/${date}/${randomUUID()}${extension}`;
  }

  private safeFileName(fileName: string) {
    return fileName
      .trim()
      .replace(/[^\w.-]+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^[.-]+|[.-]+$/g, '')
      .slice(0, 120);
  }

  private normalizeContentType(contentType?: string) {
    return (contentType ?? 'application/octet-stream')
      .split(';')[0]
      .trim()
      .toLowerCase();
  }

  private encodeKey(key: string) {
    return key.split('/').map(encodeURIComponent).join('/');
  }

  private requiredConfig(key: string) {
    const value = this.configService.get<string>(key);
    if (!value) {
      throw new BadRequestException(`Missing ${key} environment variable`);
    }
    return value;
  }
}