import { Coordinate } from '../../../types';

export interface RunningTrainingState {
  duration: number
  distance: number
  velocity: number
  routeCoordinates: Coordinate[]
  isActive: boolean
  isPaused: boolean
}