import { Coordinate } from '../../../types';
import { GeolocationError } from 'react-native';

export interface RunningTrainingState {
  duration: number
  distance: number
  velocity: number
  coordinates: Coordinate[]
  prevCoordinate: Coordinate
  error: GeolocationError | null
  isActive: boolean
  isPaused: boolean
  /** ISOString of start time */
  startTime: string | null
}