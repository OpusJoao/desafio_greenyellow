import { Provider } from '@nestjs/common';
import { S3Storage } from './infrastructure/storage/S3.storage';
import { FORMAT_DATE_INTERFACE } from './domain/contracts/formatDate.interface';
import DateUtils from './infrastructure/utils/date.utils';
import { XLSX_ADAPTER_INTERFACE } from './domain/contracts/xlsx-adapter.interface';
import ExceljsAdapterXlsx from './adapters/xlsx/exceljs-adapter.xlsx';
import ExceljsAdapterStyleBaseXlsx from './adapters/xlsx/exceljs-adapter-style-base.xlsx';

export const sharedProviders: Provider[] = [
  S3Storage,
  {
    provide: FORMAT_DATE_INTERFACE,
    useClass: DateUtils,
  },
  {
    provide: XLSX_ADAPTER_INTERFACE,
    useClass: ExceljsAdapterXlsx,
  },
  ExceljsAdapterStyleBaseXlsx,
];
