import {
  runningTrainingStarted,
  runningTrainingPaused,
  runningTrainingFinished,
  runningTrainingTick,
  runningTrainingCoordUpdated,
  runningTrainingPositionUpdated,
  runningTrainingPositionFailed,
  runningTrainingPauseToggled,
} from '../creators';
import * as runningTrainingCreators from '../creators/runningTraining';

const creatorsArray = Object.values(runningTrainingCreators);

export type _RunningTrainingAction = ReturnType<typeof creatorsArray[number]>;

type RunningTrainingStarted = ReturnType<typeof runningTrainingStarted>;
type RunningTrainingPaused = ReturnType<typeof runningTrainingPaused>;
type RunningTrainingFinished = ReturnType<typeof runningTrainingFinished>;
type RunningTrainingTick = ReturnType<typeof runningTrainingTick>;
type RunningTrainingCoordUpdated = ReturnType<typeof runningTrainingCoordUpdated>;
type RunningTrainingPositionUpdated = ReturnType<typeof runningTrainingPositionUpdated>;
type RunningTrainingPositionFailed = ReturnType<typeof runningTrainingPositionFailed>;
type RunningTrainingPauseToggled = ReturnType<typeof runningTrainingPauseToggled>;

export type RunningTrainingAction = 
  | RunningTrainingStarted
  | RunningTrainingPaused
  | RunningTrainingFinished
  | RunningTrainingTick
  | RunningTrainingCoordUpdated
  | RunningTrainingPositionUpdated
  | RunningTrainingPositionFailed
  | RunningTrainingPauseToggled