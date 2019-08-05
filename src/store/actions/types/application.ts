import { APP_DATE_UPDATED, APP_CONNECTION_STATUS_UPDATED } from '../../consts';
import { Dayjs } from 'dayjs';

export type AppDateUpdated = {
  type: typeof APP_DATE_UPDATED
  payload: Dayjs
}

export type AppConnectionStatusUpdated = {
  type: typeof APP_CONNECTION_STATUS_UPDATED
  payload: boolean
}

export type AppActions =
  | AppDateUpdated
  | AppConnectionStatusUpdated