import {
  RUNNING_TRAINING_STARTED,
  RUNNING_TRAINING_PAUSED,
  RUNNING_TRAINING_FINISHED,
  RUNNING_TRAINING_TICK,
} from '../../consts';

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