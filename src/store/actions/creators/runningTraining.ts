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
import { GeolocationReturnType, GeolocationError } from 'react-native';

export const runningTrainingStarted = () => ({
  type: RUNNING_TRAINING_STARTED
});

export const runningTrainingPaused = () => ({
  type: RUNNING_TRAINING_PAUSED
});

export const runningTrainingUnpaused = () => ({
  type: RUNNING_TRAINING_UNPAUSED
});

export const runningTrainingPauseToggled = () => ({
  type: RUNNING_TRAINING_PAUSE_TOGGLED
});

export const runningTrainingFinished = () => ({
  type: RUNNING_TRAINING_FINISHED
});

export const runningTrainingTick = () => ({
  type: RUNNING_TRAINING_TICK
});

export const runningTrainingCoordUpdated = (coordinate: Coordinate) => ({
  type: RUNNING_TRAINING_COORD_UPDATED,
  payload: coordinate
});

export const runningTrainingPositionUpdated = (position: GeolocationReturnType) => ({
  type: RUNNING_TRAINING_POSITION_UPDATED,
  payload: position
});

export const runningTrainingPositionFailed = (error: GeolocationError) => ({
  type: RUNNING_TRAINING_POSITION_FAILED,
  error
});