import ListGroupedMetricsDto from '../../presentation/dto/list-grouped-metrics.dto';
import { ResponseFindGroupedMetricsRepositoryInterface } from './find-grouped-metrics-repository.interfacec';

export type ResponseFindGroupedMetricsUseCaseInterface =
  ResponseFindGroupedMetricsRepositoryInterface;
export default interface FindGroupedMetricsUseCaseInterface {
  execute(
    queryData: ListGroupedMetricsDto,
  ): Promise<ResponseFindGroupedMetricsUseCaseInterface[]>;
}
