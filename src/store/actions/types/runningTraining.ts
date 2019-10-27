import {
  runningTrainingStarted,
  runningTrainingPaused,
  runningTrainingFinished,
  runningTrainingTick,
  runningTrainingCoordUpdated,
  runningTrainingPositionUpdated,
} from '../creators';

type RunningTrainingStarted = ReturnType<typeof runningTrainingStarted>;
type RunningTrainingPaused = ReturnType<typeof runningTrainingPaused>;
type RunningTrainingFinished = ReturnType<typeof runningTrainingFinished>;
type RunningTrainingTick = ReturnType<typeof runningTrainingTick>;
type RunningTrainingCoordUpdated = ReturnType<typeof runningTrainingCoordUpdated>;
type RunningTrainingPositionUpdated = ReturnType<typeof runningTrainingPositionUpdated>;

export type RunningTrainingAction = 
  | RunningTrainingStarted
  | RunningTrainingPaused
  | RunningTrainingFinished
  | RunningTrainingTick
  | RunningTrainingCoordUpdated
  | RunningTrainingPositionUpdated