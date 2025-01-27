import { Inject, Injectable } from '@nestjs/common';
import FindGroupedMetricsRepositoryInterface, {
  FIND_GROUPED_METRICS_REPOSITORY_INTERFACE,
} from '../../domain/contracts/find-grouped-metrics-repository.interfacec';
import FindGroupedMetricsUseCaseInterface, {
  ResponseFindGroupedMetricsUseCaseInterface,
} from '../../domain/contracts/find-grouped-metrics-use-case.interface';
import ListGroupedMetricsDto from '../../presentation/dto/list-grouped-metrics.dto';

@Injectable()
export default class FindGroupedMetricsUseCase
  implements FindGroupedMetricsUseCaseInterface
{
  constructor(
    @Inject(FIND_GROUPED_METRICS_REPOSITORY_INTERFACE)
    private readonly findGroupedMetricsRepository: FindGroupedMetricsRepositoryInterface,
  ) {}

  execute(
    queryData: ListGroupedMetricsDto,
  ): Promise<ResponseFindGroupedMetricsUseCaseInterface[]> {
    return this.findGroupedMetricsRepository.findGrouped(queryData);
  }
}
