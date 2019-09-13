import { DateDay } from '../../../types';

export interface ApplicationState {
  date: Date
  day: DateDay
  isConnected: boolean
  initialized: boolean
  status: 'INITIALIZING' | 'CREATING PROFILE'
}