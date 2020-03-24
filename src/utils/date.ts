import dayjs from 'dayjs';
import { DayjsDate, DayjsTime } from '../types';
import { DAYJS_DATE, DAYJS_TIME } from '../common/consts';

export function getDateFromDateTime(
  date: dayjs.ConfigType
): DayjsDate {
  return dayjs(date).format(DAYJS_DATE) as any as DayjsDate;
}

export function getTimeFromDateTime(
  date: dayjs.ConfigType
): DayjsTime {
  return dayjs(date).format(DAYJS_TIME) as any as DayjsTime;
}