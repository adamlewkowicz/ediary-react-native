import { APP_DATE_UPDATED, APP_CONNECTION_STATUS_UPDATED, APP_INITIALIZED } from '../../consts';
import { User } from '../../../entities';

export type AppDateUpdated = {
  type: typeof APP_DATE_UPDATED
  payload: Date
}

export type AppConnectionStatusUpdated = {
  type: typeof APP_CONNECTION_STATUS_UPDATED
  payload: boolean
}

export type AppInitialized = {
  type: typeof APP_INITIALIZED
  payload: {
    user: User
  }
}

export type AppActions =
  | AppDateUpdated
  | AppConnectionStatusUpdated
  | AppInitialized