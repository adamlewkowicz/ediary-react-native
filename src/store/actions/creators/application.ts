import {
  APP_DATE_UPDATED,
  APP_CONNECTION_STATUS_UPDATED,
  APP_STATUS_UPDATED,
} from '../../consts';
import { ApplicationStatus } from '../../../types';

export const appDateUpdated = (
  date: Date
) => ({
  type: APP_DATE_UPDATED,
  payload: date
});

export const appConnectionStatusUpdated = (
  status: boolean
) => ({
  type: APP_CONNECTION_STATUS_UPDATED,
  payload: status
});

export const appStatusUpdated = (status: ApplicationStatus) => ({
  type: APP_STATUS_UPDATED,
  payload: status
});

export type ApplicationAction =
  | ReturnType<typeof appDateUpdated>
  | ReturnType<typeof appConnectionStatusUpdated>
  | ReturnType<typeof appStatusUpdated>