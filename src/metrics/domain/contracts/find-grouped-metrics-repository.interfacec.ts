import { GroupMetricTypeEnum } from './group-metric-type.enum';

export const FIND_GROUPED_METRICS_REPOSITORY_INTERFACE =
  'FindGroupedMetricsRepositoryInterface';

export interface ResponseFindGroupedMetricsRepositoryInterface {
  date: string;
  value: number;
}

export interface FindGroupedMetricRepositoryOptionsWhereInterface {
  startDate?: Date;
  endDate?: Date;
  groupType?: GroupMetricTypeEnum;
}

export default interface FindGroupedMetricsRepositoryInterface {
  findGrouped(
    metricOptionsWhere?: FindGroupedMetricRepositoryOptionsWhereInterface,
  ): Promise<ResponseFindGroupedMetricsRepositoryInterface[]>;
}
