import { Provider } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { MetricRepository } from './adapter/repositories/metrics.repository';
import CreateMetricUseCase from './application/use-cases/create-metric.use-case';
import FindAllMetricsUseCase from './application/use-cases/find-all-metrics.use-case';
import { CREATE_METRIC_REPOSITORY_INTERFACE } from './domain/contracts/create-metric-repository.interface';
import { FIND_ALL_METRICS_REPOSITORY_INTERFACE } from './domain/contracts/find-all-metrics-repository.interface';
import { Metric } from './domain/entities/metrics.entity';
import ConsumeMetricUseCase from './application/use-cases/consume-metric.use-case';
import { FIND_ONE_BY_METRICS_REPOSITORY_INTERFACE } from './domain/contracts/find-one-by-metrics-repository.interface';
import { FIND_GROUPED_METRICS_REPOSITORY_INTERFACE } from './domain/contracts/find-grouped-metrics-repository.interfacec';
import FindGroupedMetricsUseCase from './application/use-cases/find-grouped-metrics.use-case';
import GenerateReportGroupedMetricsUseCase from './application/use-cases/generate-report-grouped-metrics.use-case';
import { FIND_GROUPED_METRICS_REPORT_REPOSITORY_INTERFACE } from './domain/contracts/find-grouped-metrics-report-repository.interface';

export const metricsProvider: Provider[] = [
  {
    provide: 'METRIC_REPOSITORY_INTERFACE',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Metric),
    inject: ['DATA_SOURCE'],
  },
  {
    provide: FIND_ALL_METRICS_REPOSITORY_INTERFACE,
    useClass: MetricRepository,
  },
  {
    provide: CREATE_METRIC_REPOSITORY_INTERFACE,
    useClass: MetricRepository,
  },
  {
    provide: FIND_ONE_BY_METRICS_REPOSITORY_INTERFACE,
    useClass: MetricRepository,
  },
  {
    provide: FIND_GROUPED_METRICS_REPOSITORY_INTERFACE,
    useClass: MetricRepository,
  },
  {
    provide: FIND_GROUPED_METRICS_REPORT_REPOSITORY_INTERFACE,
    useClass: MetricRepository,
  },
  FindAllMetricsUseCase,
  CreateMetricUseCase,
  ConsumeMetricUseCase,
  FindGroupedMetricsUseCase,
  GenerateReportGroupedMetricsUseCase,
];
