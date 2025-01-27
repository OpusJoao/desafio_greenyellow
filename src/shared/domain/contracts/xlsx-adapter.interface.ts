import * as ExcelJS from 'exceljs';
import { PassThrough } from 'stream';

export interface ConfigColumn {
  column?: number;
  width: number;
}
export interface StyleAddRow {
  column: number;
  methodStyle: Partial<ExcelJS.Style>;
}

export interface StyleRowAddRow {
  height?: number;
}

export type ValueType = string | number | Date;

export const XLSX_ADAPTER_INTERFACE = 'XlsxAdapterInterface';

export default interface XlsxAdapterInterface {
  start(): PassThrough;
  createSheet(name: string): void;
  configColumn(configColumns: ConfigColumn[]): void;
  addRow(
    values: ValueType[],
    styles?: StyleAddRow[],
    styleRow?: StyleRowAddRow,
  ): void;
  addRowMerged(
    mergedCel: string,
    valores: ValueType[],
    style?: StyleAddRow[],
    styleRow?: StyleRowAddRow,
  ): void;
  finish(): void;
}
