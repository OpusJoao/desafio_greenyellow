import { Inject } from '@nestjs/common';
import FormatDateInterface, {
  FORMAT_DATE_INTERFACE,
} from '../../../shared/domain/contracts/formatDate.interface';
import CreateMetricUseCase from './create-metric.use-case';
import { pipeline, Readable } from 'stream';
import { promisify } from 'util';
import * as csvParser from 'csv-parser';

const pipelineAsync = promisify(pipeline);

export default class ConsumeMetricUseCase {
  constructor(
    private readonly createMetricUseCase: CreateMetricUseCase,
    @Inject(FORMAT_DATE_INTERFACE)
    private readonly dateUtils: FormatDateInterface,
  ) {}

  async execute(file: Buffer) {
    const metrics: {
      metricId: number;
      datetime: Date;
      value: boolean;
    }[] = [];

    const readableStream = new Readable();
    readableStream.push(file);
    readableStream.push(null);

    await pipelineAsync(
      readableStream,
      csvParser({
        headers: ['metricId', 'dateTime', 'value'],
        skipLines: 1,
        separator: ';',
      }),
      async (source) => {
        for await (const row of source) {
          if (Object.keys(row).length === 0) return;
          const metric = {
            metricId: parseInt(row.metricId, 10),
            datetime: this.dateUtils.formatToDate(row.dateTime),
            value: row.value === '1',
          };
          metrics.push(metric);
        }
      },
    );

    for (const metricData of metrics) {
      await this.createMetricUseCase.execute(metricData);
    }
  }
}
