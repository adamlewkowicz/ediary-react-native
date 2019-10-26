import { Thunk } from '../..';
import {
  runningTrainingStarted,
  runningTrainingTick,
  runningTrainingFinished,
} from '../creators';

let interval: NodeJS.Timeout;

export const runningTrainingStart = (): Thunk => (dispatch) => {
  dispatch(runningTrainingStarted());
  interval = setInterval(() => dispatch(runningTrainingTick()), 1000);
}

export const runningTrainingStop = (): Thunk => (dispatch) => {
  clearInterval(interval);
  dispatch(runningTrainingFinished());
}