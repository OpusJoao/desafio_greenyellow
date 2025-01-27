import FormatDateInterface from '../../domain/contracts/formatDate.interface';

export default class DateUtils implements FormatDateInterface {
  formatToDate(dateTimeStr: string): Date {
    const [datePart, timePart] = dateTimeStr.split(' ');
    const [day, month, year] = datePart
      .split('/')
      .map((val) => parseInt(val, 10));

    const [hours, minutes] = timePart
      .split(':')
      .map((val) => parseInt(val, 10));

    return new Date(year, month - 1, day, hours, minutes);
  }
}
