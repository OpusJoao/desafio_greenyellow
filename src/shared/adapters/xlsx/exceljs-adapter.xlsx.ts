import * as ExcelJS from 'exceljs';
import { PassThrough } from 'stream';
import XlsxAdapterInterface, {
  ConfigColumn,
  StyleAddRow,
  StyleRowAddRow,
  ValueType,
} from '../../domain/contracts/xlsx-adapter.interface';

export default class ExceljsAdapterXlsx implements XlsxAdapterInterface {
  private workbook: ExcelJS.stream.xlsx.WorkbookWriter;
  private sheet: ExcelJS.Worksheet;

  public start(): PassThrough {
    const stream = new PassThrough();
    const options = {
      useStyles: true,
      useSharedStrings: true,
      stream: stream,
    };
    this.workbook = new ExcelJS.stream.xlsx.WorkbookWriter(options);
    return stream;
  }

  public createSheet(nome: string): void {
    this.sheet = this.workbook.addWorksheet(nome);
  }

  public configColumn(configColumns: ConfigColumn[]): void {
    for (const configColumn of configColumns) {
      this.sheet.getColumn(configColumn.column || '').width =
        configColumn.width;
    }
  }

  public addRow(
    values: ValueType[],
    styles?: StyleAddRow[],
    styleRow?: StyleRowAddRow,
  ): void {
    const row = this._addRowWithoutCommit(values, styles, styleRow);
    row.commit();
  }

  public addRowMerged(
    mergedCel: string,
    values: ValueType[],
    styles?: StyleAddRow[],
    styleRow?: StyleRowAddRow,
  ): void {
    const row = this._addRowWithoutCommit(values, styles, styleRow);
    this.sheet.mergeCells(mergedCel);
    row.commit();
  }

  public finish(): void {
    this.sheet.commit();
    void this.workbook.commit();
  }

  private _addRowWithoutCommit(
    values: ValueType[],
    styles?: StyleAddRow[],
    styleRow?: StyleRowAddRow,
  ): ExcelJS.Row {
    const row = this.sheet.addRow(values, 'i');
    if (styles !== undefined) {
      for (const style of styles) {
        row.getCell(style.column).style = style.methodStyle;
      }
    }
    if (styleRow != undefined) {
      const styleKeys = Object.keys(styleRow);
      for (const styleKey of styleKeys) {
        row[styleKey] = styleRow[styleKey];
      }
    }
    return row;
  }
}
