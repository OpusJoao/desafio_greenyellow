import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import ListGroupedMetricsDto from '../dto/list-grouped-metrics.dto';
import FindGroupedMetricsUseCase from '../../application/use-cases/find-grouped-metrics.use-case';

@Controller('metrics')
@ApiTags('metrics')
export default class ListGroupedMetricsController {
  constructor(
    private readonly findGroupedMetricsUseCase: FindGroupedMetricsUseCase,
  ) {}

  @Get('/group')
  handler(@Query() queryData: ListGroupedMetricsDto) {
    return this.findGroupedMetricsUseCase.execute(queryData);
  }
}
