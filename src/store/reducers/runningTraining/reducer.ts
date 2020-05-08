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
  RUNNING_TRAINING_PAUSE_TOGGLED,
  RUNNING_TRAINING_UNPAUSED,
} from '../../consts';
import { Coordinate } from '../../../types';
import haversine from 'haversine';
import dayjs from 'dayjs';

const calcDistance = (prevLatLng: Coordinate, nextLatLng: Coordinate): number => {
  return haversine(prevLatLng, nextLatLng) || 0;
}

const calcVelocity = (durationInSeconds: number, distanceInKm: number): number => {
  if (durationInSeconds === 0 || distanceInKm === 0) return 0;
  const durationInHours = durationInSeconds / 60 / 60;
  const velocity = distanceInKm / durationInHours;
  return velocity;
}

const initialState: RunningTrainingState = {
  duration: 0,
  distance: 0,
  velocity: 0,
  routeCoordinates: [],
  prevLatLng: { latitude: 0, longitude: 0 },
  coordinate: { latitude: 0, longitude: 0 },
  error: null,
  isActive: false,
  isPaused: false,
  startTime: null
}

export function runningTrainingReducer(
  state = initialState,
  action: RunningTrainingAction
): RunningTrainingState {
  switch(action.type) {
    case RUNNING_TRAINING_STARTED: return {
      ...initialState,
      isActive: true,
      startTime: dayjs().toISOString()
    }
    case RUNNING_TRAINING_TICK: {
      const duration = state.duration + 1;

      if (duration % 5 === 0) {
        const velocity = calcVelocity(duration, state.distance);
        return { ...state, duration, velocity };
      }
      return { ...state, duration };
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
      const prevCoordinate = state.routeCoordinates[state.routeCoordinates.length - 1];
      
      const nextDistance = prevCoordinate ? calcDistance(prevCoordinate, nextCoordinate) : 0;
      const distance = state.distance + nextDistance;

      return {
        ...state,
        distance,
        routeCoordinates: [...state.routeCoordinates, nextCoordinate],
        prevLatLng: nextCoordinate,
        coordinate: nextCoordinate,
        velocity: calcVelocity(state.duration, distance),
      }
    case RUNNING_TRAINING_POSITION_FAILED: return {
      ...state,
      error: action.error
    }
    case RUNNING_TRAINING_PAUSE_TOGGLED: return {
      ...state,
      isPaused: !state.isPaused
    }
    case RUNNING_TRAINING_UNPAUSED: return {
      ...state,
      isPaused: false
    }
    default: return state;
  }
}