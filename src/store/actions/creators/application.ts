import {
  APP_DATE_UPDATED,
  APP_CONNECTION_STATUS_UPDATED,
  APP_STATUS_UPDATED,
} from '../../consts';
import { AppDateUpdated, AppConnectionStatusUpdated } from '../types';
import { ApplicationStatus } from '../../../types';

export const appDateUpdated = (
  date: Date
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

export const appStatusUpdated = (status: ApplicationStatus) => ({
  type: APP_STATUS_UPDATED,
  payload: status
});