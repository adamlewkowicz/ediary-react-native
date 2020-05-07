import { Thunk } from '../..';
import Geolocation from '@react-native-community/geolocation';
import {
  runningTrainingStarted,
  runningTrainingTick,
  runningTrainingFinished,
  runningTrainingPositionUpdated,
  runningTrainingPositionFailed,
  runningTrainingPaused,
  runningTrainingUnpaused,
} from '../creators';

let interval: NodeJS.Timeout;
let navigatorId: number;

const _runningTrainingEffectsStop = () => {
  clearInterval(interval);
  Geolocation.clearWatch(navigatorId);
}

const runningTrainingEffectsStart = (): Thunk => async (dispatch) => {
  interval = setInterval(() => dispatch(runningTrainingTick()), 1000);

  navigatorId = Geolocation.watchPosition(position => {
    dispatch(runningTrainingPositionUpdated(position));
  }, error => {
    dispatch(runningTrainingPositionFailed(error));
  }, {
    enableHighAccuracy: true, timeout: 20000, maximumAge: 1000
  });
}

export const runningTrainingStart = (): Thunk => async (dispatch) => {
  dispatch(runningTrainingStarted());
  dispatch(runningTrainingEffectsStart());
}

export const runningTrainingPauseToggle = (enablePause: boolean): Thunk<void> => (dispatch) => {
  if (enablePause) {
    _runningTrainingEffectsStop();
    dispatch(runningTrainingPaused());
  } else {
    dispatch(runningTrainingUnpaused());
    dispatch(runningTrainingEffectsStart());
  }
}

export const runningTrainingFinish = (): Thunk<void> => (dispatch) => {
  _runningTrainingEffectsStop();
  dispatch(runningTrainingFinished());
}