import {
  RUNNING_TRAINING_STARTED,
  RUNNING_TRAINING_PAUSED,
  RUNNING_TRAINING_FINISHED,
  RUNNING_TRAINING_TICK,
  RUNNING_TRAINING_COORD_UPDATED,
  RUNNING_TRAINING_POSITION_UPDATED,
} from '../../consts';
import { Coordinate } from '../../../types';
import { GeolocationReturnType } from 'react-native';

export const runningTrainingStarted = () => ({
  type: RUNNING_TRAINING_STARTED
});

export const runningTrainingPaused = () => ({
  type: RUNNING_TRAINING_PAUSED
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