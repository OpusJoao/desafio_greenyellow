import { Metric } from '../entities/metrics.entity';

export const FIND_ONE_BY_METRICS_REPOSITORY_INTERFACE =
  'FindOneByMetricsRepositoryInterface';

export default interface FindOneByMetricsRepositoryInterface {
  findOneBy(metricData: Partial<Metric>): Promise<Metric | null>;
}
