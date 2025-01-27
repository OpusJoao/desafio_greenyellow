import { Module } from '@nestjs/common';
import MetricsModule from './metrics/metrics.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MetricsModule,
  ],
  controllers: [],
})
export class AppModule {}
