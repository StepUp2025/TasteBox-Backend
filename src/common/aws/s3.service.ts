import {
  DeleteObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FileDomain } from '../enums/s3.enum';
import { S3DeleteFailException } from './exceptions/s3-delete-fail.exception';
import { S3UploadFailException } from './exceptions/s3-upload-fail.exception';

interface UploadFileOptions {
  file: Express.Multer.File;
  domain: FileDomain;
  userId: number;
}

@Injectable()
export class S3Service {
  private readonly logger = new Logger(S3Service.name);
  private readonly s3Client: S3Client;
  private readonly bucketName: string;
  private readonly region: string;

  constructor(private readonly configService: ConfigService) {
    this.region = this.configService.getOrThrow<string>('AWS_REGION');
    this.bucketName =
      this.configService.getOrThrow<string>('AWS_S3_BUCKET_NAME');

    this.s3Client = new S3Client({
      region: this.region,
      credentials: {
        accessKeyId: this.configService.getOrThrow<string>('AWS_ACCESS_KEY_ID'),
        secretAccessKey: this.configService.getOrThrow<string>(
          'AWS_SECRET_ACCESS_KEY',
        ),
      },
    });
  }

  async uploadFile({
    file,
    domain,
    userId,
  }: UploadFileOptions): Promise<string> {
    const key = `uploads/${domain}/${userId}/${Date.now()}-${file.originalname}`;

    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
    });

    try {
      await this.s3Client.send(command);
      return `https://s3.${this.region}.amazonaws.com/${this.bucketName}/${key}`;
    } catch (error) {
      this.logger.error('S3 Upload Error', error);
      throw new S3UploadFailException();
    }
  }

  async deleteFile(key: string): Promise<void> {
    const command = new DeleteObjectCommand({
      Bucket: this.bucketName,
      Key: key,
    });
    this.logger.log(key);
    try {
      await this.s3Client.send(command);
    } catch (error) {
      this.logger.error('S3 Delete Error', error);
      throw new S3DeleteFailException();
    }
  }
}
