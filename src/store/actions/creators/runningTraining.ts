import {
  RUNNING_TRAINING_STARTED,
  RUNNING_TRAINING_PAUSED,
  RUNNING_TRAINING_FINISHED,
  RUNNING_TRAINING_TICK,
  RUNNING_TRAINING_COORD_UPDATED,
} from '../../consts';
import { Coordinate } from '../../../types';

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