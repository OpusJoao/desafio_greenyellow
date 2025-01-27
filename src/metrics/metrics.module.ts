import { Module } from '@nestjs/common';
import ProcessMetricsController from './presentation/controller/process-metrics.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import SharedModule from '../shared/shared.module';
import ConsumeMetricsController from './presentation/controller/consume-metrics.controller';
import { DatabaseModule } from '../database/infrastructure/providers/database.module';
import ListMetricsController from './presentation/controller/list-metrics.controller';
import { metricsProvider } from './metrics.provider';
import ListGroupedMetricsController from './presentation/controller/list-grouped-metrics.controller';
import ReportGroupedMetricsController from './presentation/controller/report-grouped-metrics.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  controllers: [
    ProcessMetricsController,
    ConsumeMetricsController,
    ListMetricsController,
    ListGroupedMetricsController,
    ReportGroupedMetricsController,
  ],
  imports: [
    ClientsModule.registerAsync([
      {
        imports: [ConfigModule],
        inject: [ConfigService],
        name: 'TRANSACTION_ENGINE_SERVICE',
        useFactory: (configService: ConfigService) => ({
          transport: Transport.RMQ,
          options: {
            urls: [
              configService.get<string>('RABBITMQ_URL') ||
                'amqp://guest:guest@host.docker.internal:5672?heartbeat=0',
            ],
            queue: 'processing-transports-queue',
            queueOptions: {
              deadLetterExchange: 'retry-processing-transports-exchange',
              deadLetterRoutingKey: 'retry-processing-transports',
            },
            noAck: true,
          },
        }),
      },
    ]),
    SharedModule,
    DatabaseModule,
  ],
  providers: metricsProvider,
  exports: metricsProvider,
})
export default class MetricsModule {}
