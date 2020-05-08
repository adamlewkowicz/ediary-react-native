import { Coordinate } from '../../../types';
import { GeolocationError } from 'react-native';

export interface RunningTrainingState {
  duration: number
  distance: number
  velocity: number
  routeCoordinates: Coordinate[]
  prevLatLng: Coordinate
  coordinate: Coordinate
  error: GeolocationError | null
  isActive: boolean
  isPaused: boolean
  startTime: string | null
}