import { Injectable } from '@nestjs/common';
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { PassThrough, Readable } from 'stream';
@Injectable()
export class S3Storage {
  private s3Client: S3Client;

  constructor() {
    this.s3Client = new S3Client({
      endpoint: 'http://host.docker.internal:4566',
      region: 'us-east-1',
      forcePathStyle: true,
      credentials: {
        accessKeyId: '000000000001',
        secretAccessKey: '000000000001',
      },
    });
  }

  async uploadFile(
    buffer: Buffer | PassThrough,
    filename: string,
    isReport = false,
  ): Promise<{ bucket: string; key: string }> {
    if (!isReport) filename = `${Date.now()}_${filename}`;
    const command = new PutObjectCommand({
      Bucket: 'metrics',
      Key: filename,
      Body:
        buffer instanceof PassThrough
          ? await this.streamToBuffer(buffer)
          : buffer,
    });

    try {
      await this.s3Client.send(command);
      return {
        bucket: 'metrics',
        key: filename,
      };
    } catch (error: unknown) {
      console.log(error);
      return {
        bucket: '',
        key: '',
      };
    }
  }

  async generatePresignedUrl(
    bucketName: string,
    objectKey: string,
    expiresIn: number = 86400,
  ): Promise<string> {
    const command = new GetObjectCommand({
      Bucket: bucketName,
      Key: objectKey,
    });
    const url = await getSignedUrl(this.s3Client, command, { expiresIn });
    return url;
  }

  async readFile(bucketName: string, objectKey: string): Promise<Buffer> {
    const command = new GetObjectCommand({
      Bucket: bucketName,
      Key: objectKey,
    });

    const data = await this.s3Client.send(command);
    const fileStream = data.Body as Readable;

    return new Promise((resolve, reject) => {
      const chunks: Buffer[] = []; // Armazena os chunks como Buffers

      fileStream.on('data', (chunk) => {
        // Adiciona cada chunk ao array
        chunks.push(Buffer.from(chunk));
      });

      fileStream.on('end', () => {
        // Concatena todos os chunks em um único Buffer
        const fullBuffer = Buffer.concat(chunks);
        resolve(fullBuffer);
      });

      fileStream.on('error', (err) => {
        // Rejeita a Promise em caso de erro
        reject(err);
      });
    });
  }

  streamToBuffer(stream: PassThrough): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const chunks: Buffer[] = [];

      stream.on('data', (chunk) => {
        chunks.push(chunk); // Acumula os pedaços de dados
      });

      stream.on('end', () => {
        resolve(Buffer.concat(chunks)); // Junta os pedaços em um único Buffer
      });

      stream.on('error', (err) => {
        reject(err); // Caso haja erro no stream
      });
    });
  }
}
