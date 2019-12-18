import { Thunk } from '../..';
import {
  gymTrainingDurationTick,
  gymTrainingStarted,
  gymTrainingFinished,
} from '../creators/gymTraining';

let durationInterval: NodeJS.Timeout;

export const gymTrainingStart: Thunk<void> = () => (dispatch) => {
  dispatch(gymTrainingStarted());

  durationInterval = setInterval(() => {
    dispatch(gymTrainingDurationTick());
  }, 1000);
}

export const gymExerciseSetUpdate = () => {
  
}

export const gymTrainingFinish: Thunk<void> = () => (dispatch) => {
  clearInterval(durationInterval);
  dispatch(gymTrainingFinished);
}