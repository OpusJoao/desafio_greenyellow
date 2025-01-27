import { TestingModule, Test } from '@nestjs/testing';
import FindGroupedMetricsUseCase from '../../../../src/metrics/application/use-cases/find-grouped-metrics.use-case';
import FindGroupedMetricsRepositoryInterface, {
  FIND_GROUPED_METRICS_REPOSITORY_INTERFACE,
  ResponseFindGroupedMetricsRepositoryInterface,
} from '../../../../src/metrics/domain/contracts/find-grouped-metrics-repository.interfacec';
import ListGroupedMetricsDto from '../../../../src/metrics/presentation/dto/list-grouped-metrics.dto';
import { GroupMetricTypeEnum } from '../../../../src/metrics/domain/contracts/group-metric-type.enum';

describe('FindGroupedMetricsUseCase', () => {
  let findGroupedMetricsUseCase: FindGroupedMetricsUseCase;
  let findGroupedMetricsRepository: jest.Mocked<FindGroupedMetricsRepositoryInterface>;

  beforeEach(async () => {
    findGroupedMetricsRepository = {
      findGrouped: jest.fn(),
    } as jest.Mocked<FindGroupedMetricsRepositoryInterface>;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FindGroupedMetricsUseCase,
        {
          provide: FIND_GROUPED_METRICS_REPOSITORY_INTERFACE,
          useValue: findGroupedMetricsRepository,
        },
      ],
    }).compile();

    findGroupedMetricsUseCase = module.get<FindGroupedMetricsUseCase>(
      FindGroupedMetricsUseCase,
    );
  });

  it('deve chamar findGrouped no repositório com os parâmetros corretos', async () => {
    // Dado
    const queryData: ListGroupedMetricsDto = {
      groupType: GroupMetricTypeEnum.DAY,
    };
    const mockResponse: ResponseFindGroupedMetricsRepositoryInterface[] = [
      {
        date: new Date().toLocaleString(),
        value: 1,
      },
    ];
    findGroupedMetricsRepository.findGrouped.mockResolvedValueOnce(
      mockResponse,
    );

    // Quando
    const result = await findGroupedMetricsUseCase.execute(queryData);

    // Então
    expect(findGroupedMetricsRepository.findGrouped).toHaveBeenCalledWith(
      queryData,
    );
    expect(result).toEqual(mockResponse);
  });

  it('deve retornar o resultado correto quando o repositório retorna métricas agrupadas', async () => {
    // Dado
    const queryData: ListGroupedMetricsDto = {
      groupType: GroupMetricTypeEnum.DAY,
    };
    const mockResponse: ResponseFindGroupedMetricsRepositoryInterface[] = [
      {
        date: new Date().toLocaleString(),
        value: 1,
      },
      {
        date: new Date().toLocaleString(),
        value: 23,
      },
    ];
    findGroupedMetricsRepository.findGrouped.mockResolvedValueOnce(
      mockResponse,
    );

    // Quando
    const result = await findGroupedMetricsUseCase.execute(queryData);

    // Então
    expect(result).toEqual(mockResponse);
    expect(findGroupedMetricsRepository.findGrouped).toHaveBeenCalledTimes(1);
  });

  it('deve lidar corretamente quando o repositório retorna uma lista vazia', async () => {
    // Dado
    const queryData: ListGroupedMetricsDto = {
      groupType: GroupMetricTypeEnum.DAY,
    };

    const mockResponse: any[] = [];
    findGroupedMetricsRepository.findGrouped.mockResolvedValueOnce(
      mockResponse,
    );

    // Quando
    const result = await findGroupedMetricsUseCase.execute(queryData);

    // Então
    expect(result).toEqual(mockResponse);
    expect(findGroupedMetricsRepository.findGrouped).toHaveBeenCalledTimes(1);
  });

  it('deve lançar erro se o repositório falhar', async () => {
    // Dado
    const queryData: ListGroupedMetricsDto = {
      groupType: GroupMetricTypeEnum.DAY,
    };

    findGroupedMetricsRepository.findGrouped.mockRejectedValueOnce(
      new Error('Repositório falhou'),
    );

    // Quando
    await expect(findGroupedMetricsUseCase.execute(queryData)).rejects.toThrow(
      'Repositório falhou',
    );
  });
});
