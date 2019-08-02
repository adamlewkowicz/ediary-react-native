import { Dayjs } from 'dayjs';
import { APP_DATE_UPDATED } from '../../consts';
import { AppDateUpdated } from '../types';

export const appDateUpdated = (
  date: Dayjs
): AppDateUpdated => ({
  type: APP_DATE_UPDATED,
  payload: date
});