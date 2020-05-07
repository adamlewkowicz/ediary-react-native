import * as runningTrainingCreators from '../creators/runningTraining';
import { ValueOf } from '../../../types';
export type RunningTrainingAction = ReturnType<ValueOf<typeof runningTrainingCreators>>;