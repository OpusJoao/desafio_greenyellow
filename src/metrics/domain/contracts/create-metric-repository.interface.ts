import { Metric } from '../entities/metrics.entity';

export const CREATE_METRIC_REPOSITORY_INTERFACE =
  'CreateMetricRepositoryInterface';

export default interface CreateMetricRepositoryInterface {
  create(metricData: Partial<Metric>): Promise<Metric>;
}
