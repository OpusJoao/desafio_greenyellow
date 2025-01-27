export const FORMAT_DATE_INTERFACE = 'FormatDateInterface';

export default interface FormatDateInterface {
  formatToDate(dateTimeStr: string): Date;
}
