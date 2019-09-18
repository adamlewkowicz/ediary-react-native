import { DateDay } from '../../../types';

export interface ApplicationState {
  date: Date
  day: DateDay
  todayDate: Date
  todayDay: DateDay
  isConnected: boolean
  initialized: boolean
  status: 'INITIALIZING' | 'CREATING PROFILE'
}