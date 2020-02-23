import {
  APP_DATE_UPDATED,
  APP_CONNECTION_STATUS_UPDATED,
  APP_STATUS_UPDATED,
} from '../../consts';
import { ApplicationStatus } from '../../../types';

export type AppDateUpdated = {
  type: typeof APP_DATE_UPDATED
  payload: Date
}

export type AppConnectionStatusUpdated = {
  type: typeof APP_CONNECTION_STATUS_UPDATED
  payload: boolean
}

export type AppStatusUpdated = {
  type: typeof APP_STATUS_UPDATED
  payload: ApplicationStatus
}

export type AppActions =
  | AppDateUpdated
  | AppConnectionStatusUpdated
  | AppStatusUpdated