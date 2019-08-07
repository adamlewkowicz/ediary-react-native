import { APP_DATE_UPDATED, APP_CONNECTION_STATUS_UPDATED, APP_INITIALIZED } from '../../consts';
import { AppDateUpdated, AppConnectionStatusUpdated, AppInitialized } from '../types';
import { User } from '../../../entities';

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

export const appInitialized = (
  user: User
): AppInitialized => ({
  type: APP_INITIALIZED,
  payload: {
    user
  }
});