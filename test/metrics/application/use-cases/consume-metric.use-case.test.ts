import ConsumeMetricUseCase from '../../../../src/metrics/application/use-cases/consume-metric.use-case';
import CreateMetricUseCase from '../../../../src/metrics/application/use-cases/create-metric.use-case';
import FormatDateInterface from '../../../../src/shared/domain/contracts/formatDate.interface';

describe('ConsumeMetricUseCase', () => {
  let consumeMetricUseCase: ConsumeMetricUseCase;
  let createMetricUseCase: CreateMetricUseCase;
  let dateUtils: FormatDateInterface;

  beforeEach(() => {
    createMetricUseCase = {
      execute: jest.fn(), // Mock do método execute
    } as unknown as CreateMetricUseCase;

    dateUtils = {
      formatToDate: jest.fn((date: string) => new Date(date)), // Mock para formatar a data
    } as unknown as FormatDateInterface;

    consumeMetricUseCase = new ConsumeMetricUseCase(
      createMetricUseCase,
      dateUtils,
    );
  });

  it('deve processar o arquivo CSV e chamar CreateMetricUseCase para cada métrica', async () => {
    // Simula o conteúdo do arquivo CSV
    const mockCsv = Buffer.from(
      'metricId;dateTime;value\n1;2023-10-23T10:00:00;1\n2;2023-10-23T11:00:00;0',
    );

    // Chama o método execute
    await consumeMetricUseCase.execute(mockCsv);

    // Verifica se o método formatToDate foi chamado corretamente
    expect(dateUtils.formatToDate).toHaveBeenCalledWith('2023-10-23T10:00:00');
    expect(dateUtils.formatToDate).toHaveBeenCalledWith('2023-10-23T11:00:00');

    // Verifica se o CreateMetricUseCase foi chamado com os dados corretos
    expect(createMetricUseCase.execute).toHaveBeenCalledTimes(2);
    expect(createMetricUseCase.execute).toHaveBeenCalledWith({
      metricId: 1,
      datetime: new Date('2023-10-23T10:00:00'),
      value: true,
    });
    expect(createMetricUseCase.execute).toHaveBeenCalledWith({
      metricId: 2,
      datetime: new Date('2023-10-23T11:00:00'),
      value: false,
    });
  });

  it('deve ignorar uma linha vazia no CSV', async () => {
    // Simula o conteúdo do arquivo CSV com uma linha vazia
    const mockCsv = Buffer.from(
      'metricId;dateTime;value\n\n1;2023-10-23T10:00:00;1\n',
    );

    // Chama o método execute
    await consumeMetricUseCase.execute(mockCsv);

    expect(createMetricUseCase.execute).toHaveBeenCalledTimes(0);

    expect(createMetricUseCase.execute).not.toHaveBeenCalledWith({
      metricId: undefined,
      datetime: undefined,
      value: undefined,
    });
  });
});
