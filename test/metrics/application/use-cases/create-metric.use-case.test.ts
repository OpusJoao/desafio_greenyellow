import { Test, TestingModule } from '@nestjs/testing';
import CreateMetricUseCase from '../../../../src/metrics/application/use-cases/create-metric.use-case';
import CreateMetricRepositoryInterface, {
  CREATE_METRIC_REPOSITORY_INTERFACE,
} from '../../../../src/metrics/domain/contracts/create-metric-repository.interface';
import FindOneByMetricsRepositoryInterface, {
  FIND_ONE_BY_METRICS_REPOSITORY_INTERFACE,
} from '../../../../src/metrics/domain/contracts/find-one-by-metrics-repository.interface';
import { Metric } from '../../../../src/metrics/domain/entities/metrics.entity';

describe('CreateMetricUseCase', () => {
  let createMetricUseCase: CreateMetricUseCase;
  let createMetricRepository: jest.Mocked<CreateMetricRepositoryInterface>;
  let findOneByMetricsRepository: jest.Mocked<FindOneByMetricsRepositoryInterface>;

  beforeEach(async () => {
    createMetricRepository = {
      create: jest.fn(),
    } as jest.Mocked<CreateMetricRepositoryInterface>;

    findOneByMetricsRepository = {
      findOneBy: jest.fn(),
    } as jest.Mocked<FindOneByMetricsRepositoryInterface>;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateMetricUseCase,
        {
          provide: CREATE_METRIC_REPOSITORY_INTERFACE,
          useValue: createMetricRepository,
        },
        {
          provide: FIND_ONE_BY_METRICS_REPOSITORY_INTERFACE,
          useValue: findOneByMetricsRepository,
        },
      ],
    }).compile();

    createMetricUseCase = module.get<CreateMetricUseCase>(CreateMetricUseCase);
  });

  it('deve criar uma nova métrica se não existir', async () => {
    // Dado
    const metricData: Metric = {
      id: 0,
      metricId: 1,
      value: true,
      datetime: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    findOneByMetricsRepository.findOneBy.mockResolvedValueOnce(null); // Não encontrou métrica
    createMetricRepository.create.mockResolvedValueOnce(metricData);
    // Quando
    const result = await createMetricUseCase.execute(metricData);

    // Então
    expect(findOneByMetricsRepository.findOneBy).toHaveBeenCalledWith(
      metricData,
    );
    expect(createMetricRepository.create).toHaveBeenCalledWith(metricData);
    expect(result).toEqual(metricData);
  });

  it('deve retornar a métrica existente se ela já existir', async () => {
    // Dado
    const metricData: Metric = {
      id: 0,
      metricId: 1,
      value: true,
      datetime: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const existingMetric = { ...metricData, id: 1 };
    findOneByMetricsRepository.findOneBy.mockResolvedValueOnce(existingMetric); // Encontrou métrica existente

    // Quando
    const result = await createMetricUseCase.execute(metricData);

    // Então
    expect(findOneByMetricsRepository.findOneBy).toHaveBeenCalledWith(
      metricData,
    );
    expect(createMetricRepository.create).not.toHaveBeenCalled(); // Não deve chamar create se a métrica já existir
    expect(result).toEqual(existingMetric);
  });

  it('deve chamar o método create do repositório se a métrica não existir', async () => {
    // Dado
    const metricData: Partial<Metric> = {
      metricId: 1,
      value: false,
      datetime: new Date(),
    };
    findOneByMetricsRepository.findOneBy.mockResolvedValueOnce(null); // Não encontrou métrica

    // Quando
    await createMetricUseCase.execute(metricData);

    // Então
    expect(createMetricRepository.create).toHaveBeenCalledTimes(1);
    expect(createMetricRepository.create).toHaveBeenCalledWith(metricData);
  });

  it('não deve chamar o método create se a métrica já existir', async () => {
    // Dado
    const metricData: Metric = {
      id: 0,
      metricId: 1,
      value: true,
      datetime: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const existingMetric = { ...metricData, id: 1 };
    findOneByMetricsRepository.findOneBy.mockResolvedValueOnce(existingMetric); // Encontrou métrica

    // Quando
    await createMetricUseCase.execute(metricData);

    // Então
    expect(createMetricRepository.create).not.toHaveBeenCalled(); // O método create não deve ser chamado
  });
});
