import dayjs from 'dayjs';
import { DayjsDate, DayjsTime, DayjsTimeBase } from '../types';
import { DAYJS_DATE, DAYJS_TIME, DAYJS_TIME_BASE } from '../common/consts';

const createDateFormatter = <T>(format: string) => {
  return (date: dayjs.ConfigType): T => {
    return dayjs(date).format(format) as any as T;
  }
}

export const getDateFromDateTime = createDateFormatter<DayjsDate>(DAYJS_DATE);

export const getTimeFromDateTime = createDateFormatter<DayjsTime>(DAYJS_TIME);

export const getTimeBaseFromDateTime = createDateFormatter<DayjsTimeBase>(DAYJS_TIME_BASE);