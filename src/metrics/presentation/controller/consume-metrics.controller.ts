import { Controller, Logger } from '@nestjs/common';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import { S3Storage } from '../../../shared/infrastructure/storage/S3.storage';
import ConsumeMetricUseCase from '../../application/use-cases/consume-metric.use-case';
@Controller()
export default class ConsumeMetricsController {
  private readonly logger = new Logger(ConsumeMetricsController.name);
  private readonly maxRetries = 3;
  constructor(
    private readonly s3Storage: S3Storage,
    private readonly consumeMetricUseCase: ConsumeMetricUseCase,
  ) {}
  @EventPattern('process-metrics-queue')
  async handler(@Payload() data: any, @Ctx() context: RmqContext) {
    this.logger.log(`Processando mensagem: ${JSON.stringify(data)}`);
    const channel = context.getChannelRef();
    const originalMessage = context.getMessage();
    try {
      const file = await this.s3Storage.readFile(data.bucket, data.key);
      await this.consumeMetricUseCase.execute(file);
      this.logger.log('Arquivo processado com sucesso!');
      channel.ack(originalMessage);
    } catch (error) {
      const retryCount = this.getRetryCount(originalMessage);

      if (retryCount < this.maxRetries) {
        this.logger.warn(
          `Tentativa ${retryCount} falhou. Reenviando para a fila. Erro: ${error.message}`,
        );
        channel.nack(originalMessage, false, false);
      } else {
        this.logger.error(
          `Tentativa ${retryCount} falhou. Excedeu o limite de ${this.maxRetries} tentativas.`,
        );
        channel.nack(originalMessage, false, false);
      }
    }
  }

  getRetryCount(message: any): number {
    const retryCountHeader = message.properties.headers['x-retry-count'];
    return retryCountHeader ? parseInt(retryCountHeader, 10) : 0;
  }
}
