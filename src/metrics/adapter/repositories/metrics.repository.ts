import { Injectable, Inject } from '@nestjs/common';
import {
  Between,
  LessThanOrEqual,
  MoreThanOrEqual,
  Repository,
  SelectQueryBuilder,
} from 'typeorm';
import { Metric } from '../../domain/entities/metrics.entity';
import FindAllMetricsRepositoryInterface, {
  FindAllMetricRepositoryOptionsWhereInterface,
  ResponseFindAllMetricsRepositoryInterface,
} from '../../domain/contracts/find-all-metrics-repository.interface';
import FindOneByMetricsRepository from '../../domain/contracts/find-one-by-metrics-repository.interface';
import { GroupMetricTypeEnum } from '../../domain/contracts/group-metric-type.enum';
import FindGroupedMetricsRepositoryInterface, {
  FindGroupedMetricRepositoryOptionsWhereInterface,
  ResponseFindGroupedMetricsRepositoryInterface,
} from '../../domain/contracts/find-grouped-metrics-repository.interfacec';
import FindGroupedMetricsReportRepositoryInterface, {
  FindGroupedMetricReportRepositoryOptionsWhereInterface,
  ResponseFindGroupedMetricsReportRepositoryInterface,
} from '../../domain/contracts/find-grouped-metrics-report-repository.interface';

@Injectable()
export class MetricRepository
  implements
    FindAllMetricsRepositoryInterface,
    FindOneByMetricsRepository,
    FindGroupedMetricsRepositoryInterface,
    FindGroupedMetricsReportRepositoryInterface
{
  constructor(
    @Inject('METRIC_REPOSITORY_INTERFACE')
    private metricRepository: Repository<Metric>,
  ) {}

  async findAll(
    metricOptions: FindAllMetricRepositoryOptionsWhereInterface,
    page: number = 1,
    pageSize: number = 10,
  ): Promise<ResponseFindAllMetricsRepositoryInterface> {
    const skip = (page - 1) * pageSize;
    const take = pageSize;

    const whereAndOrderBy = this.buildWhereAndOrderBy(metricOptions);

    const [data, total] = await this.metricRepository.findAndCount({
      where: whereAndOrderBy.where,
      order: whereAndOrderBy.order,
      skip,
      take,
    });

    return {
      data,
      currentPage: page,
      limit: pageSize,
      totalItems: total,
      totalPage: Math.ceil(total / pageSize),
    };
  }

  async create(metricData: Partial<Metric>): Promise<Metric> {
    const metric = this.metricRepository.create(metricData);
    return await this.metricRepository.save(metric);
  }

  async findOneBy(metricData: Partial<Metric>): Promise<Metric | null> {
    const metric = await this.metricRepository.findOne({
      where: metricData,
    });

    return metric;
  }

  async findGrouped(
    metricOptions: FindGroupedMetricRepositoryOptionsWhereInterface,
  ): Promise<ResponseFindGroupedMetricsRepositoryInterface[]> {
    const groupExpression =
      metricOptions.groupType === GroupMetricTypeEnum.YEAR
        ? `DATE_TRUNC('year', date_time)`
        : metricOptions.groupType === GroupMetricTypeEnum.MONTH
          ? `DATE_TRUNC('month', date_time)`
          : `DATE_TRUNC('day', date_time)`;
    let queryBuilder = this.metricRepository
      .createQueryBuilder('metric')
      .select(`${groupExpression} AS date`)
      .addSelect('COUNT(*) AS value')
      .groupBy('date')
      .orderBy('date', 'ASC');

    queryBuilder =
      this.buildWhereAndOrderBy(metricOptions, true, queryBuilder)
        .queryBuilder || queryBuilder;

    return queryBuilder.getRawMany();
  }

  async findGroupedReport(
    metricOptions: FindGroupedMetricReportRepositoryOptionsWhereInterface,
  ): Promise<ResponseFindGroupedMetricsReportRepositoryInterface[]> {
    let queryBuilder = this.metricRepository
      .createQueryBuilder('metric')
      .select('metric.metric_id', 'MetricId')
      .addSelect('DATE(metric.date_time)', 'dateTime')
      .addSelect('COUNT(*)', 'AggDay')
      .addSelect(
        "SUM(COUNT(*)) OVER (PARTITION BY DATE_TRUNC('month', metric.date_time))",
        'AggMonth',
      )
      .addSelect(
        "SUM(COUNT(*)) OVER (PARTITION BY DATE_TRUNC('year', metric.date_time))",
        'AggYear',
      )
      .groupBy('DATE(metric.date_time)')
      .addGroupBy("DATE_TRUNC('month', metric.date_time)")
      .addGroupBy("DATE_TRUNC('year', metric.date_time)")
      .addGroupBy('metric.metric_id')
      .orderBy('DATE(metric.date_time)');

    queryBuilder =
      this.buildWhereAndOrderBy(metricOptions, true, queryBuilder)
        .queryBuilder || queryBuilder;

    return (await queryBuilder.getRawMany()).map((value) => ({
      date: value.dateTime,
      metricId: value.MetricId,
      valueDay: value.AggDay,
      valueMonth: value.AggMonth,
      valueYear: value.AggYear,
    }));
  }

  private buildWhereAndOrderBy(
    metricOptions: Partial<FindAllMetricRepositoryOptionsWhereInterface>,
    IsRawQuery?: boolean,
    queryBuilder?: SelectQueryBuilder<Metric>,
  ) {
    const where: any = {};
    const order: any = {};
    const { metricId, startDate, endDate, value, orderBy } = metricOptions;

    if (IsRawQuery && queryBuilder) {
      // Aplica os filtros dinamicamente
      if (metricId) {
        queryBuilder.andWhere('metric.metricId = :metricId', { metricId });
      }

      if (value !== undefined) {
        queryBuilder.andWhere('metric.value = :value', { value });
      }

      if (startDate && endDate) {
        queryBuilder.andWhere(
          'metric.datetime BETWEEN :startDate AND :endDate',
          {
            startDate,
            endDate,
          },
        );
      } else if (startDate) {
        queryBuilder.andWhere('metric.datetime >= :startDate', { startDate });
      } else if (endDate) {
        queryBuilder.andWhere('metric.datetime <= :endDate', { endDate });
      }
    } else {
      if (metricId) where.metricId = metricId;
      if (value !== undefined) where.value = value;

      if (startDate && endDate) {
        where.datetime = Between(startDate, endDate);
      } else if (startDate) {
        where.datetime = MoreThanOrEqual(startDate);
      } else if (endDate) {
        where.datetime = LessThanOrEqual(endDate);
      }

      if (orderBy) {
        const [field, direction] = orderBy.split(':');
        order[field] = direction.toUpperCase();
      }
    }

    return {
      where,
      order,
      queryBuilder,
    };
  }
}
