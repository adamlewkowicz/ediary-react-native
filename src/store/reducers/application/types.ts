import { DateDay, ApplicationStatus } from '../../../types';

export interface ApplicationState {
  date: Date
  day: DateDay
  todayDate: Date
  todayDay: DateDay
  isConnected: boolean
  status: ApplicationStatus
}