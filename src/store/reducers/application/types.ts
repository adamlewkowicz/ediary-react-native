import { DayjsDate } from '../../../types';

export interface ApplicationState {
  date: Date
  day: DayjsDate
  todayDate: Date
  todayDay: DayjsDate
  isConnected: boolean
}