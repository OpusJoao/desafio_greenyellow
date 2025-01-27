import { TestingModule, Test } from '@nestjs/testing';
import GenerateReportGroupedMetricsUseCase from '../../../../src/metrics/application/use-cases/generate-report-grouped-metrics.use-case';
import FindGroupedMetricsReportRepositoryInterface, {
  FIND_GROUPED_METRICS_REPORT_REPOSITORY_INTERFACE,
} from '../../../../src/metrics/domain/contracts/find-grouped-metrics-report-repository.interface';
import ListGroupedMetricsReportDto from '../../../../src/metrics/presentation/dto/list-grouped-metrics-report.dto';
import XlsxAdapterInterface, {
  XLSX_ADAPTER_INTERFACE,
} from '../../../../src/shared/domain/contracts/xlsx-adapter.interface';
import { S3Storage } from '../../../../src/shared/infrastructure/storage/S3.storage';

describe('GenerateReportGroupedMetricsUseCase', () => {
  let generateReportGroupedMetricsUseCase: GenerateReportGroupedMetricsUseCase;
  let xlsxAdapter: jest.Mocked<XlsxAdapterInterface>;
  let findGroupedMetricsReportRepository: jest.Mocked<FindGroupedMetricsReportRepositoryInterface>;
  let s3Storage: jest.Mocked<S3Storage>;

  beforeEach(async () => {
    xlsxAdapter = {
      start: jest.fn(),
      createSheet: jest.fn(),
      addRow: jest.fn(),
      addRowMerged: jest.fn(),
      finish: jest.fn(),
      configColumn: jest.fn(),
    } as jest.Mocked<XlsxAdapterInterface>;

    findGroupedMetricsReportRepository = {
      findGroupedReport: jest.fn(),
    } as jest.Mocked<FindGroupedMetricsReportRepositoryInterface>;

    s3Storage = {
      generatePresignedUrl: jest.fn(),
      readFile: jest.fn(),
      uploadFile: jest.fn(),
    } as unknown as jest.Mocked<S3Storage>;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GenerateReportGroupedMetricsUseCase,
        {
          provide: XLSX_ADAPTER_INTERFACE,
          useValue: xlsxAdapter,
        },
        {
          provide: FIND_GROUPED_METRICS_REPORT_REPOSITORY_INTERFACE,
          useValue: findGroupedMetricsReportRepository,
        },
        {
          provide: S3Storage,
          useValue: s3Storage,
        },
      ],
    }).compile();

    generateReportGroupedMetricsUseCase =
      module.get<GenerateReportGroupedMetricsUseCase>(
        GenerateReportGroupedMetricsUseCase,
      );
  });

  it('deve chamar os métodos corretamente quando dados são encontrados', async () => {
    // Dado
    const queryData: ListGroupedMetricsReportDto = {
      endDate: new Date(),
      startDate: new Date(),
      metricId: 1,
    };
    const mockData = [
      {
        metricId: 1,
        date: '2023-01-01',
        valueDay: 5,
        valueMonth: 30,
        valueYear: 365,
      },
    ];
    findGroupedMetricsReportRepository.findGroupedReport.mockResolvedValueOnce(
      mockData,
    );
    s3Storage.uploadFile.mockResolvedValueOnce({
      bucket: 'bucket',
      key: 'key',
    });
    s3Storage.generatePresignedUrl.mockResolvedValueOnce('http://url.com');

    // Quando
    const result = await generateReportGroupedMetricsUseCase.execute(queryData);

    // Então
    expect(
      findGroupedMetricsReportRepository.findGroupedReport,
    ).toHaveBeenCalledWith(queryData);
    expect(xlsxAdapter.start).toHaveBeenCalled();
    expect(xlsxAdapter.createSheet).toHaveBeenCalledWith('Relatório XLSX');
    expect(xlsxAdapter.addRow).toHaveBeenCalledWith(
      ['MetricId', 'DateTime', 'AggDay', 'AggMonth', 'AggYear'],
      [],
    );
    expect(xlsxAdapter.addRow).toHaveBeenCalledWith(
      [1, '2023-01-01', 5, 30, 365],
      expect.anything(),
    );
    expect(s3Storage.uploadFile).toHaveBeenCalled();
    expect(s3Storage.generatePresignedUrl).toHaveBeenCalled();
    expect(result).toEqual({ link: 'http://url.com' });
  });

  it('deve gerar relatório informando "Nenhum registro encontrado" quando não houver dados', async () => {
    // Dado
    const queryData: ListGroupedMetricsReportDto = {
      endDate: new Date(),
      startDate: new Date(),
      metricId: 1,
    };
    findGroupedMetricsReportRepository.findGroupedReport.mockResolvedValueOnce(
      new Promise((resolve) => resolve([])),
    );

    s3Storage.uploadFile.mockResolvedValueOnce(
      new Promise<{ bucket: string; key: string }>((resolve) =>
        resolve({ bucket: 'b', key: 'k' }),
      ),
    );

    // Quando
    const result = await generateReportGroupedMetricsUseCase.execute(queryData);

    // Então
    expect(xlsxAdapter.addRowMerged).toHaveBeenCalledWith(
      'A1:F1',
      ['Relatório'],
      [],
      { height: 30 },
    );
    expect(xlsxAdapter.addRowMerged).toHaveBeenCalledWith(
      'A2:F2',
      ['Nenhum registro encontrado'],
      [],
    );
    expect(result).toEqual({ link: undefined });
  });

  it('deve chamar os métodos corretamente e retornar URL mesmo quando não houver dados', async () => {
    // Dado
    const queryData: ListGroupedMetricsReportDto = {
      endDate: new Date(),
      startDate: new Date(),
      metricId: 1,
    };
    findGroupedMetricsReportRepository.findGroupedReport.mockResolvedValueOnce(
      new Promise((resolve) => resolve([])),
    );
    s3Storage.uploadFile.mockResolvedValueOnce({
      bucket: 'bucket',
      key: 'key',
    });
    s3Storage.generatePresignedUrl.mockResolvedValueOnce('http://url.com');

    // Quando
    const result = await generateReportGroupedMetricsUseCase.execute(queryData);

    // Então
    expect(xlsxAdapter.addRowMerged).toHaveBeenCalledWith(
      'A1:F1',
      ['Relatório'],
      [],
      { height: 30 },
    );
    expect(xlsxAdapter.addRowMerged).toHaveBeenCalledWith(
      'A2:F2',
      ['Nenhum registro encontrado'],
      [],
    );
    expect(result).toEqual({ link: 'http://url.com' });
  });

  it('deve lançar erro se o repositório falhar', async () => {
    // Dado
    const queryData: ListGroupedMetricsReportDto = {
      endDate: new Date(),
      startDate: new Date(),
      metricId: 1,
    };
    findGroupedMetricsReportRepository.findGroupedReport.mockRejectedValueOnce(
      new Error('Erro ao buscar dados'),
    );

    // Quando
    await expect(
      generateReportGroupedMetricsUseCase.execute(queryData),
    ).rejects.toThrow('Erro ao buscar dados');
  });
});
