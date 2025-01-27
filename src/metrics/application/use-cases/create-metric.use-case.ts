import { Inject, Injectable } from '@nestjs/common';
import { Metric } from '../../domain/entities/metrics.entity';
import CreateMetricRepositoryInterface, {
  CREATE_METRIC_REPOSITORY_INTERFACE,
} from '../../domain/contracts/create-metric-repository.interface';
import FindOneByMetricsRepositoryInterface, {
  FIND_ONE_BY_METRICS_REPOSITORY_INTERFACE,
} from '../../domain/contracts/find-one-by-metrics-repository.interface';

@Injectable()
export default class CreateMetricUseCase {
  constructor(
    @Inject(CREATE_METRIC_REPOSITORY_INTERFACE)
    private readonly createMetricRepository: CreateMetricRepositoryInterface,
    @Inject(FIND_ONE_BY_METRICS_REPOSITORY_INTERFACE)
    private readonly findOneByMetricsRepository: FindOneByMetricsRepositoryInterface,
  ) {}

  async execute(metric: Partial<Metric>): Promise<Metric> {
    const metricFound = await this.findOneByMetricsRepository.findOneBy(metric);
    if (!metricFound) {
      return this.createMetricRepository.create(metric);
    }
    return metricFound;
  }
}
