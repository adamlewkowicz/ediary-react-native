import dayjs from 'dayjs';
import { AppActions } from '../actions/types/application';
import { APP_DATE_UPDATED } from '../consts';

const date = new Date;

const initialState: ApplicationState = {
  date,
  day: dayjs(date).format('YYYY-MM-DD')
}

export function applicationReducer(
  state = initialState,
  action: AppActions
): ApplicationState {
  switch(action.type) {
    case APP_DATE_UPDATED: return {
      ...state,
      date: new Date(action.payload.toISOString()),
      day: action.payload.format('YYYY-MM-DD')
    }
    default: return state;
  }
}

interface ApplicationState {
  date: Date
  day: string
}