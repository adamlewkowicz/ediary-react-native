import dayjs from 'dayjs';
import { AppActions } from '../actions/types/application';
import {
  APP_DATE_UPDATED,
  APP_CONNECTION_STATUS_UPDATED,
  APP_INITIALIZED
} from '../consts';

const date = new Date;

const initialState: ApplicationState = {
  date,
  day: dayjs(date).format('YYYY-MM-DD'),
  isConnected: false,
  initialized: false
}

export function applicationReducer(
  state = initialState,
  action: AppActions
): ApplicationState {
  switch(action.type) {
    case APP_INITIALIZED: return {
      ...state,
      initialized: true
    }
    case APP_DATE_UPDATED: return {
      ...state,
      date: new Date(action.payload.toISOString()),
      day: action.payload.format('YYYY-MM-DD')
    }
    case APP_CONNECTION_STATUS_UPDATED: return {
      ...state,
      isConnected: action.payload
    }
    default: return state;
  }
}

interface ApplicationState {
  date: Date
  day: string
  isConnected: boolean
  initialized: boolean
}