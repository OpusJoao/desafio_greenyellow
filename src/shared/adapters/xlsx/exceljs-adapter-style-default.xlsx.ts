import * as ExcelJS from 'exceljs';
export default class ExceljsAdapterStyleDefaultXlsx {
  public getDefaultStyleTitulo(): Partial<ExcelJS.Style> {
    return {
      alignment: { horizontal: 'center', vertical: 'middle' },
    };
  }

  public getDefaultStyleData(): Partial<ExcelJS.Style> {
    return {
      alignment: { horizontal: 'center' },
    };
  }

  public getDefaultStyleNumber(): Partial<ExcelJS.Style> {
    return {
      alignment: { horizontal: 'center' },
    };
  }

  public getDefaultStyleText(): Partial<ExcelJS.Style> {
    return {
      alignment: { horizontal: 'left' },
    };
  }

  public getDefaultStyleMoney(isNegativo = false): Partial<ExcelJS.Style> {
    return {
      alignment: { horizontal: 'right' },
      numFmt: isNegativo ? '-R$ #,##0.00' : 'R$ #,##0.00',
    };
  }
}
