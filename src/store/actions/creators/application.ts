import { Dayjs } from 'dayjs';
import { APP_DATE_UPDATED, APP_CONNECTION_STATUS_UPDATED } from '../../consts';
import { AppDateUpdated, AppConnectionStatusUpdated } from '../types';

export const appDateUpdated = (
  date: Dayjs
): AppDateUpdated => ({
  type: APP_DATE_UPDATED,
  payload: date
});

export const appConnectionStatusUpdated = (
  status: boolean
): AppConnectionStatusUpdated => ({
  type: APP_CONNECTION_STATUS_UPDATED,
  payload: status
});