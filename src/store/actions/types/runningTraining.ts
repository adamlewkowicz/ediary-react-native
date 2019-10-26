import {
  runningTrainingStarted,
  runningTrainingPaused,
  runningTrainingFinished,
  runningTrainingTick,
} from '../creators';

type RunningTrainingStarted = ReturnType<typeof runningTrainingStarted>;
type RunningTrainingPaused = ReturnType<typeof runningTrainingPaused>;
type RunningTrainingFinished = ReturnType<typeof runningTrainingFinished>;
type RunningTrainingTick = ReturnType<typeof runningTrainingTick>;

export type RunningTrainingAction = 
  | RunningTrainingStarted
  | RunningTrainingPaused
  | RunningTrainingFinished
  | RunningTrainingTick