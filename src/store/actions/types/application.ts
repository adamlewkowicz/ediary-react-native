import { APP_DATE_UPDATED } from '../../consts';
import { Dayjs } from 'dayjs';

export type AppDateUpdated = {
  type: typeof APP_DATE_UPDATED
  payload: Dayjs
}

export type AppActions =
  | AppDateUpdated