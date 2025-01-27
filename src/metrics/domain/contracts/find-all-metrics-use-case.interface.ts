import ListMetricsDto from '../../presentation/dto/list-metrics.dto';
import { ResponseFindAllMetricsRepositoryInterface } from './find-all-metrics-repository.interface';

export type ResponseFindAllMetricsUseCaseInterface =
  ResponseFindAllMetricsRepositoryInterface;
export default interface FindAllMetricsUseCaseInterface {
  execute(
    queryData: ListMetricsDto,
  ): Promise<ResponseFindAllMetricsUseCaseInterface>;
}
