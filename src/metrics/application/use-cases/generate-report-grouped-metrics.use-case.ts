import { Inject, Injectable } from '@nestjs/common';
import XlsxAdapterInterface, {
  XLSX_ADAPTER_INTERFACE,
} from '../../../shared/domain/contracts/xlsx-adapter.interface';
import { S3Storage } from '../../../shared/infrastructure/storage/S3.storage';
import FindGroupedMetricsReportRepositoryInterface, {
  FIND_GROUPED_METRICS_REPORT_REPOSITORY_INTERFACE,
  ResponseFindGroupedMetricsReportRepositoryInterface,
} from '../../domain/contracts/find-grouped-metrics-report-repository.interface';
import ListGroupedMetricsReportDto from '../../presentation/dto/list-grouped-metrics-report.dto';

@Injectable()
export default class GenerateReportGroupedMetricsUseCase {
  constructor(
    @Inject(XLSX_ADAPTER_INTERFACE)
    private readonly xlsxAdapter: XlsxAdapterInterface,
    @Inject(FIND_GROUPED_METRICS_REPORT_REPOSITORY_INTERFACE)
    private readonly findGroupedMetricsReportRepository: FindGroupedMetricsReportRepositoryInterface,
    private readonly s3Storage: S3Storage,
  ) {}
  async execute(queryData: ListGroupedMetricsReportDto) {
    const dataFound =
      await this.findGroupedMetricsReportRepository.findGroupedReport(
        queryData,
      );

    const stream = this.xlsxAdapter.start();
    this.xlsxAdapter.createSheet('Relatório XLSX');
    if (!dataFound || dataFound.length == 0) {
      this.xlsxAdapter.addRowMerged('A1:F1', ['Relatório'], [], { height: 30 });
      this.xlsxAdapter.addRowMerged(
        'A2:F2',
        ['Nenhum registro encontrado'],
        [],
      );
    } else {
      this.setConfigColumn();
      this.setHeader();
      for (const dado of dataFound) {
        this.setDados(dado);
      }
    }
    this.xlsxAdapter.finish();

    const reportName = `Relatório-${Date.now()}.xlsx`;

    const isReport = true;

    const fileUploaded = await this.s3Storage.uploadFile(
      stream,
      reportName,
      isReport,
    );

    const link = await this.s3Storage.generatePresignedUrl(
      fileUploaded.bucket,
      fileUploaded.key,
    );

    return {
      link,
    };
  }

  private setHeader(): void {
    this.xlsxAdapter.addRow(
      ['MetricId', 'DateTime', 'AggDay', 'AggMonth', 'AggYear'],
      [],
    );
  }

  private setDados(
    dado: ResponseFindGroupedMetricsReportRepositoryInterface,
  ): void {
    this.xlsxAdapter.addRow(
      [
        dado.metricId,
        dado.date,
        dado.valueDay,
        dado.valueMonth,
        dado.valueYear,
      ],
      [
        { column: 1, methodStyle: {} },
        {
          column: 2,
          methodStyle: {
            // numFmt: 'text',
          },
        },
      ],
    );
  }

  private setConfigColumn(): void {
    this.xlsxAdapter.configColumn([
      { column: 1, width: 44 },
      { column: 2, width: 44 },
      { column: 3, width: 44 },
      { column: 4, width: 44 },
      { column: 5, width: 44 },
    ]);
  }
}
