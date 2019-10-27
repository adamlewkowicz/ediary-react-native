import { Thunk } from '../..';
import Geolocation from '@react-native-community/geolocation';
import {
  runningTrainingStarted,
  runningTrainingTick,
  runningTrainingFinished,
  runningTrainingPositionUpdated,
  runningTrainingPositionFailed,
} from '../creators';
import { getCurrentPosition } from '../../../common/utils';

let interval: NodeJS.Timeout;
let navigatorId: number;

export const runningTrainingStart = (): Thunk => async (dispatch) => {
  const currentPosition = await getCurrentPosition();

  dispatch(runningTrainingStarted(currentPosition));

  interval = setInterval(() => dispatch(runningTrainingTick()), 1000);

  navigatorId = Geolocation.watchPosition(position => {
    dispatch(runningTrainingPositionUpdated(position));
  }, error => {
    dispatch(runningTrainingPositionFailed(error));
  }, {
    enableHighAccuracy: true, timeout: 20000, maximumAge: 1000
  });
}

export const runningTrainingFinish = (): Thunk => (dispatch) => {
  clearInterval(interval);
  Geolocation.clearWatch(navigatorId);
  dispatch(runningTrainingFinished());
}