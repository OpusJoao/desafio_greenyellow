import { Controller, Get, Query } from '@nestjs/common';
import FindAllMetricsUseCase from '../../application/use-cases/find-all-metrics.use-case';
import { ApiTags } from '@nestjs/swagger';
import ListMetricsDto from '../dto/list-metrics.dto';

@Controller('metrics')
@ApiTags('metrics')
export default class ListMetricsController {
  constructor(private readonly findAllMetricsUseCase: FindAllMetricsUseCase) {}

  @Get('/')
  handler(@Query() queryData: ListMetricsDto) {
    return this.findAllMetricsUseCase.execute(queryData);
  }
}
