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
    enableHighAccuracy: true, timeout: 1000, maximumAge: 1000
  });
}

export const runningTrainingStart = (): Thunk => async (dispatch) => {
  Geolocation.getCurrentPosition(position => {
    dispatch(runningTrainingPositionUpdated(position));
  });

  dispatch(runningTrainingStarted());
  dispatch(runningTrainingEffectsStart());
}

export const runningTrainingFinish = (): Thunk<void> => (dispatch) => {
  _runningTrainingEffectsStop();
  dispatch(runningTrainingFinished());
}

export const runningTrainingPause = (): Thunk<void> => (dispatch) => {
  _runningTrainingEffectsStop();
  dispatch(runningTrainingPaused());
}

export const runningTrainingUnpause = (): Thunk<void> => (dispatch) => {
  dispatch(runningTrainingUnpaused());
  dispatch(runningTrainingEffectsStart());
}