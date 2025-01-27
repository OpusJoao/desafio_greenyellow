import {
  BadRequestException,
  Controller,
  Inject,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { S3Storage } from '../../../shared/infrastructure/storage/S3.storage';
import { ClientProxy } from '@nestjs/microservices';

@Controller('metrics')
@ApiTags('metrics')
export default class ProcessMetricsController {
  constructor(
    @Inject('TRANSACTION_ENGINE_SERVICE')
    private readonly client: ClientProxy,
    private readonly s3Storage: S3Storage,
  ) {}

  @Post('process-metrics')
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  async handler(@UploadedFile() file: Express.Multer.File) {
    if (!file || !file.originalname.endsWith('.csv')) {
      throw new BadRequestException('O arquivo enviado não é um CSV.');
    }

    const fileUploaded = await this.s3Storage.uploadFile(
      file.buffer,
      file.originalname,
    );
    this.client.emit('process-metrics-queue', fileUploaded);

    return {
      message: 'ok',
    };
  }
}
