import { RunningTrainingState } from './types';
import { RunningTrainingAction } from '../../actions/types/runningTraining';
import {
  RUNNING_TRAINING_STARTED,
  RUNNING_TRAINING_PAUSED,
  RUNNING_TRAINING_FINISHED,
  RUNNING_TRAINING_TICK,
  RUNNING_TRAINING_COORD_UPDATED,
  RUNNING_TRAINING_POSITION_UPDATED,
  RUNNING_TRAINING_POSITION_FAILED,
} from '../../consts';
import { Coordinate } from '../../../types';
import haversine from 'haversine';

const calcDistance = (prevLatLng: Coordinate, nextLatLng: Coordinate): number => {
  return haversine(prevLatLng, nextLatLng) || 0;
}

const initialState: RunningTrainingState = {
  duration: 0,
  distance: 0,
  velocity: 0,
  routeCoordinates: [],
  prevLatLng: { latitude: 0, longitude: 0 },
  startCoordinate: { latitude: 0, longitude: 0 },
  error: null,
  isActive: false,
  isPaused: false,
}

export function runningTrainingReducer(
  state = initialState,
  action: RunningTrainingAction
): RunningTrainingState {
  switch(action.type) {
    case RUNNING_TRAINING_STARTED: {
      const { latitude, longitude } = action.payload.coords;
      const startCoordinate: Coordinate = { latitude, longitude };
      return {
        ...initialState,
        isActive: true,
        prevLatLng: startCoordinate,
        routeCoordinates: [startCoordinate],
        startCoordinate
      }
    }
    case RUNNING_TRAINING_TICK: return {
      ...state,
      duration: state.duration + 1
    }
    case RUNNING_TRAINING_PAUSED: return {
      ...state,
      isPaused: true
    }
    case RUNNING_TRAINING_FINISHED: return {
      ...state,
      isActive: false,
      isPaused: false
    }
    case RUNNING_TRAINING_COORD_UPDATED: return {
      ...state,
      routeCoordinates: [...state.routeCoordinates, action.payload]
    }
    case RUNNING_TRAINING_POSITION_UPDATED:
      const { longitude, latitude } = action.payload.coords;
      const nextCoordinate: Coordinate = { longitude, latitude };

      const distance = calcDistance(state.prevLatLng, nextCoordinate);

      return {
        ...state,
        distance: state.distance + distance,
        routeCoordinates: [...state.routeCoordinates, nextCoordinate],
        prevLatLng: nextCoordinate,
      }
    case RUNNING_TRAINING_POSITION_FAILED: return {
      ...state,
      error: action.error
    }
    default: return state;
  }
}