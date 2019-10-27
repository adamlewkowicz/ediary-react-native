import { Thunk } from '../..';
import {
  runningTrainingStarted,
  runningTrainingTick,
  runningTrainingFinished,
  runningTrainingPositionUpdated,
  runningTrainingPositionFailed,
} from '../creators';

let interval: NodeJS.Timeout;
let navigatorId: number;

export const runningTrainingStart = (): Thunk => (dispatch) => {
  dispatch(runningTrainingStarted());

  interval = setInterval(() => dispatch(runningTrainingTick()), 1000);

  navigatorId = navigator.geolocation.watchPosition(position => {
    dispatch(runningTrainingPositionUpdated(position));
  }, error => {
    dispatch(runningTrainingPositionFailed(error));
  }, {
    enableHighAccuracy: true, timeout: 20000, maximumAge: 1000
  });
}

export const runningTrainingStop = (): Thunk => (dispatch) => {
  clearInterval(interval);
  navigator.geolocation.clearWatch(navigatorId);
  dispatch(runningTrainingFinished());
}