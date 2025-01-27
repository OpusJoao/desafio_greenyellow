import { TestingModule, Test } from '@nestjs/testing';
import FindAllMetricsUseCase from '../../../../src/metrics/application/use-cases/find-all-metrics.use-case';
import FindAllMetricsRepositoryInterface, {
  FIND_ALL_METRICS_REPOSITORY_INTERFACE,
  ResponseFindAllMetricsRepositoryInterface,
} from '../../../../src/metrics/domain/contracts/find-all-metrics-repository.interface';
import ListMetricsDto from '../../../../src/metrics/presentation/dto/list-metrics.dto';

describe('FindAllMetricsUseCase', () => {
  let findAllMetricsUseCase: FindAllMetricsUseCase;
  let findAllMetricsRepository: jest.Mocked<FindAllMetricsRepositoryInterface>;

  beforeEach(async () => {
    findAllMetricsRepository = {
      findAll: jest.fn(),
    } as jest.Mocked<FindAllMetricsRepositoryInterface>;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FindAllMetricsUseCase,
        {
          provide: FIND_ALL_METRICS_REPOSITORY_INTERFACE,
          useValue: findAllMetricsRepository,
        },
      ],
    }).compile();

    findAllMetricsUseCase = module.get<FindAllMetricsUseCase>(
      FindAllMetricsUseCase,
    );
  });

  it('deve chamar findAll no repositório com os parâmetros corretos', async () => {
    // Dado
    const queryData: ListMetricsDto = { page: 1, pageSize: 10 };
    const mockResponse: ResponseFindAllMetricsRepositoryInterface = {
      data: [],
      currentPage: queryData.page || 1,
      limit: queryData.pageSize || 10,
      totalItems: 0,
      totalPage: 1,
    };
    findAllMetricsRepository.findAll.mockResolvedValueOnce(mockResponse);

    // Quando
    const result = await findAllMetricsUseCase.execute(queryData);

    // Então
    expect(findAllMetricsRepository.findAll).toHaveBeenCalledWith(
      queryData,
      queryData.page,
      queryData.pageSize,
    );
    expect(result).toEqual(mockResponse);
  });

  it('deve retornar o resultado correto quando o repositório retorna métricas', async () => {
    // Dado
    const queryData: ListMetricsDto = { page: 2, pageSize: 5 };
    const mockResponse: ResponseFindAllMetricsRepositoryInterface = {
      data: [
        {
          id: 1,
          metricId: 1,
          value: true,
          datetime: new Date(),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 2,
          metricId: 1,
          value: true,
          datetime: new Date(),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      currentPage: queryData.page || 1,
      limit: queryData.pageSize || 10,
      totalItems: 0,
      totalPage: 1,
    };
    findAllMetricsRepository.findAll.mockResolvedValueOnce(mockResponse);

    // Quando
    const result = await findAllMetricsUseCase.execute(queryData);

    // Então
    expect(result).toEqual(mockResponse);
    expect(findAllMetricsRepository.findAll).toHaveBeenCalledTimes(1);
  });

  it('deve lidar corretamente quando o repositório retorna uma lista vazia', async () => {
    // Dado
    const queryData: ListMetricsDto = { page: 1, pageSize: 10 };
    const mockResponse: ResponseFindAllMetricsRepositoryInterface = {
      data: [],
      currentPage: queryData.page || 1,
      limit: queryData.pageSize || 10,
      totalItems: 0,
      totalPage: 1,
    };
    findAllMetricsRepository.findAll.mockResolvedValueOnce(mockResponse);

    // Quando
    const result = await findAllMetricsUseCase.execute(queryData);

    // Então
    expect(result).toEqual(mockResponse);
    expect(findAllMetricsRepository.findAll).toHaveBeenCalledTimes(1);
  });

  it('deve lançar erro se o repositório falhar', async () => {
    // Dado
    const queryData: ListMetricsDto = { page: 1, pageSize: 10 };
    findAllMetricsRepository.findAll.mockRejectedValueOnce(
      new Error('Repositório falhou'),
    );

    // Quando
    await expect(findAllMetricsUseCase.execute(queryData)).rejects.toThrow(
      'Repositório falhou',
    );
  });
});
