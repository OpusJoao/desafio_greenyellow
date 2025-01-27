import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import GenerateReportGroupedMetricsUseCase from '../../application/use-cases/generate-report-grouped-metrics.use-case';
import ListGroupedMetricsReportDto from '../dto/list-grouped-metrics-report.dto';

@Controller('metrics')
@ApiTags('metrics')
export default class ReportGroupedMetricsController {
  constructor(
    private readonly generateReportGroupedMetricsUseCase: GenerateReportGroupedMetricsUseCase,
  ) {}

  @Get('/group/report')
  handler(@Query() queryData: ListGroupedMetricsReportDto) {
    return this.generateReportGroupedMetricsUseCase.execute(queryData);
  }
}
