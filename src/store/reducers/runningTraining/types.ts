import { Coordinate } from '../../../types';

export interface RunningTrainingState {
  duration: number
  distance: number
  velocity: number
  routeCoordinates: Coordinate[]
  prevLatLng: Coordinate
  isActive: boolean
  isPaused: boolean
}