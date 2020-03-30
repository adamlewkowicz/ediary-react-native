import { DayjsDate, ApplicationStatus } from '../../../types';

export interface ApplicationState {
  date: Date
  day: DayjsDate
  todayDate: Date
  todayDay: DayjsDate
  isConnected: boolean
  status: ApplicationStatus
}