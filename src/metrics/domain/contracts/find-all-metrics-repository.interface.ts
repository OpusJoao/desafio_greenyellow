import { Metric } from '../entities/metrics.entity';

export const FIND_ALL_METRICS_REPOSITORY_INTERFACE =
  'FindAllMetricsRepositoryInterface';

export interface ResponseFindAllMetricsRepositoryInterface {
  data: Metric[];
  currentPage: number;
  totalPage: number;
  totalItems: number;
  limit: number;
}

export interface FindAllMetricRepositoryOptionsWhereInterface {
  metricId?: number;
  startDate?: Date;
  endDate?: Date;
  value?: boolean;
  orderBy?: string;
}

export default interface FindAllMetricsRepositoryInterface {
  findAll(
    metricOptionsWhere?: FindAllMetricRepositoryOptionsWhereInterface,
    page?: number,
    pageSize?: number,
  ): Promise<ResponseFindAllMetricsRepositoryInterface>;
}
