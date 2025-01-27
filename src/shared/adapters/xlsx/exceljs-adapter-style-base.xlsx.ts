import * as ExcelJS from 'exceljs';
import ExceljsAdapterStyleDefaultXlsx from './exceljs-adapter-style-default.xlsx';
export default class ExceljsAdapterStyleBaseXlsx extends ExceljsAdapterStyleDefaultXlsx {
  public getBaseStyleTitulo(): Partial<ExcelJS.Style> {
    return {
      ...this.getDefaultStyleTitulo(),
      font: { name: 'Arial', family: 2, size: 14, bold: true },
    };
  }

  public getBaseStyleCabecalho(): Partial<ExcelJS.Style> {
    return {
      fill: {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF5D75B7' },
      },
      ...this.getDefaultStyleTitulo(),
      font: {
        color: { argb: 'FFFFFFFF' },
        name: 'Arial',
        family: 2,
        size: 10,
        bold: true,
      },
    };
  }

  public getBaseStyleColunaPadrao(): Partial<ExcelJS.Style> {
    return {
      ...this.getDefaultStyleText(),
      font: this.getBaseFont(),
    };
  }

  public getBaseStyleColunaDataHoraMinutoSegundo(): Partial<ExcelJS.Style> {
    const styleColunaPadrao = this.getBaseStyleColunaPadrao();
    return {
      ...styleColunaPadrao,
      numFmt: 'DD/MM/YYYY HH:MM:SS',
    };
  }

  public getBaseStyleGridColunaCredido(): Partial<ExcelJS.Style> {
    const styleColunaPadrao = this.getBaseStyleColunaPadrao();
    return {
      ...styleColunaPadrao,
      ...this.getDefaultStyleMoney(),
      font: { ...styleColunaPadrao.font, color: { argb: 'FF558ED5' } },
    };
  }

  public getBaseStyleGridColunaDebito(): Partial<ExcelJS.Style> {
    const styleColunaPadrao = this.getBaseStyleColunaPadrao();
    return {
      ...styleColunaPadrao,
      ...this.getDefaultStyleMoney(true),
      font: { ...styleColunaPadrao.font, color: { argb: 'ff0000' } },
    };
  }

  public getBasePreenchimento(): ExcelJS.Fill {
    return {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'f5f5f5' },
    };
  }

  public getBaseFontColor(): string {
    return '666666';
  }

  public getBaseFont(): Partial<ExcelJS.Font> {
    return {
      color: { argb: this.getBaseFontColor() },
      name: 'Arial',
      family: 2,
      size: 10,
    };
  }

  public getBaseBorderColor(): string {
    return 'cccccc';
  }

  public getBaseBorder(): Partial<ExcelJS.Borders> {
    return {
      bottom: {
        color: { argb: this.getBaseBorderColor() },
        style: 'thin',
      },
    };
  }
}
