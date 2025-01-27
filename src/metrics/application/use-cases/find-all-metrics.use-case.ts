import { Inject, Injectable } from '@nestjs/common';
import FindAllMetricsRepositoryInterface, {
  FIND_ALL_METRICS_REPOSITORY_INTERFACE,
} from '../../domain/contracts/find-all-metrics-repository.interface';
import FindAllMetricsUseCaseInterface, {
  ResponseFindAllMetricsUseCaseInterface,
} from '../../domain/contracts/find-all-metrics-use-case.interface';
import ListMetricsDto from '../../presentation/dto/list-metrics.dto';

@Injectable()
export default class FindAllMetricsUseCase
  implements FindAllMetricsUseCaseInterface
{
  constructor(
    @Inject(FIND_ALL_METRICS_REPOSITORY_INTERFACE)
    private readonly findAllMetricsRepository: FindAllMetricsRepositoryInterface,
  ) {}

  execute(
    queryData: ListMetricsDto,
  ): Promise<ResponseFindAllMetricsUseCaseInterface> {
    return this.findAllMetricsRepository.findAll(
      queryData,
      queryData.page,
      queryData.pageSize,
    );
  }
}
