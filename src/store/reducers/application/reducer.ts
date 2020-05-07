import {
  APP_DATE_UPDATED,
  APP_CONNECTION_STATUS_UPDATED,
} from '../../consts';
import { DayjsDate } from '../../../types';
import dayjs from 'dayjs';
import { ApplicationState } from './types';
import { ApplicationAction } from '../../actions';
import * as Utils from '../../../utils';

const date = new Date;
const todayDateDay = Utils.getDateFromDateTime(date);

const initialState: ApplicationState = {
  date,
  day: todayDateDay,
  todayDate: date,
  todayDay: todayDateDay,
  isConnected: false,
}

export function applicationReducer(
  state = initialState,
  action: ApplicationAction
): ApplicationState {
  switch(action.type) {
    case APP_DATE_UPDATED: return {
      ...state,
      date: action.payload,
      day: dayjs(action.payload).format('YYYY-MM-DD') as any as DayjsDate
    }
    case APP_CONNECTION_STATUS_UPDATED: return {
      ...state,
      isConnected: action.payload
    }
    default: return state;
  }
}