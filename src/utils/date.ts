import dayjs from 'dayjs';
import { DateDay, DateTime } from '../types';
import { DATE_DAY, DATE_TIME } from '../common/consts';

export function getDayFromDate(
  date: dayjs.ConfigType
): DateDay {
  const dateDay: DateDay = dayjs(date).format(DATE_DAY) as any;
  return dateDay;
}

export function getTimeFromDate(
  date: dayjs.ConfigType
) {
  const dateTime: DateTime = dayjs(date).format(DATE_TIME) as any;
  return dateTime;
}