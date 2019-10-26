import { RunningTrainingState } from './types';
import { RunningTrainingAction } from '../../actions/types/runningTraining';
import {
  RUNNING_TRAINING_STARTED,
  RUNNING_TRAINING_PAUSED,
  RUNNING_TRAINING_FINISHED,
  RUNNING_TRAINING_TICK,
  RUNNING_TRAINING_COORD_UPDATED,
} from '../../consts';

const initialState: RunningTrainingState = {
  duration: 0,
  distance: 0,
  velocity: 0,
  routeCoordinates: [],
  isActive: false,
  isPaused: false,
}

export function runningTrainingReducer(
  state = initialState,
  action: RunningTrainingAction
): RunningTrainingState {
  switch(action.type) {
    case RUNNING_TRAINING_STARTED: return {
      ...state,
      isActive: true
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
    default: return state;
  }
}