import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  const configService = app.get(ConfigService);

  const configFila = {
    url:
      configService.get<string>('RABBITMQ_URL') ||
      'amqp://guest:guest@host.docker.internal:5672?heartbeat=0',
    customerQueueName: 'processing-transports-queue',
    noAck: false,
    customerPrefetchCount:
      Number(configService.get('RABBITMQ_CUSTOMER_PREFETCH_COUNT')) || 10,
  };

  const config = new DocumentBuilder()
    .setTitle('Cats example')
    .setDescription('The cats API description')
    .setVersion('1.0')
    .addTag('metrics')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, documentFactory);

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [configFila.url],
      queue: configFila.customerQueueName,
      queueOptions: {
        deadLetterExchange: 'retry-processing-transports-exchange',
        deadLetterRoutingKey: 'retry-processing-transports',
      },
      noAck: false,
      prefetchCount: configFila.customerPrefetchCount,
    },
  });

  await app.startAllMicroservices();

  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
