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
import { getCurrentPosition } from '../../../common/utils';

let interval: NodeJS.Timeout;
let navigatorId: number;

const _clearEffects = () => {
  clearInterval(interval);
  Geolocation.clearWatch(navigatorId);
}

const runningTrainingEffectsStart: Thunk = () => async (dispatch) => {
  interval = setInterval(() => dispatch(runningTrainingTick()), 1000);

  navigatorId = Geolocation.watchPosition(position => {
    dispatch(runningTrainingPositionUpdated(position));
  }, error => {
    dispatch(runningTrainingPositionFailed(error));
  }, {
    enableHighAccuracy: true, timeout: 20000, maximumAge: 1000
  });
}

export const runningTrainingStart: Thunk = () => async (dispatch) => {
  const currentPosition = await getCurrentPosition();
  dispatch(runningTrainingStarted(currentPosition));
  dispatch(runningTrainingEffectsStart());
}

export const runningTrainingPauseToggle: Thunk = (
  enablePause: boolean
) => async (dispatch) => {
  if (enablePause) {
    _clearEffects();
    dispatch(runningTrainingPaused());
  } else {
    dispatch(runningTrainingUnpaused());
    dispatch(runningTrainingEffectsStart());
  }
}

export const runningTrainingFinish: Thunk<void> = () => (dispatch) => {
  _clearEffects();
  dispatch(runningTrainingFinished());
}