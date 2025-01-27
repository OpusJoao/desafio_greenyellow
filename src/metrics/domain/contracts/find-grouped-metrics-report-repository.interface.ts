export const FIND_GROUPED_METRICS_REPORT_REPOSITORY_INTERFACE =
  'FindGroupedMetricsReportRepositoryInterface';

export interface ResponseFindGroupedMetricsReportRepositoryInterface {
  metricId: number;
  date: string;
  valueDay: number;
  valueMonth: number;
  valueYear: number;
}

export interface FindGroupedMetricReportRepositoryOptionsWhereInterface {
  metricId: number;
  startDate: Date;
  endDate: Date;
}

export default interface FindGroupedMetricsReportRepositoryInterface {
  findGroupedReport(
    metricOptionsWhere?: FindGroupedMetricReportRepositoryOptionsWhereInterface,
  ): Promise<ResponseFindGroupedMetricsReportRepositoryInterface[]>;
}
