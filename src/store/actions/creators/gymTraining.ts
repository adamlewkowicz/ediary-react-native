import {
  GYM_TRAINING_STARTED,
  GYM_TRAINING_DURATION_TICK,
  GYM_TRAINING_FINISHED,
  GYM_EXERCISE_SET_UPDATED,
} from '../../consts';
import { ExerciseSetId } from '../../../types';
import { ExerciseSetState } from '../../reducers/gymTraining/types';

export const gymTrainingStarted = () => ({
  type: GYM_TRAINING_STARTED
});

export const gymTrainingDurationTick = () => ({
  type: GYM_TRAINING_DURATION_TICK
});

export const gymTrainingFinished = () => ({
  type: GYM_TRAINING_FINISHED
});

export const gymExerciseSetUpdated = (
  exerciseSetId: ExerciseSetId,
  payload: Partial<ExerciseSetState>
) => ({
  type: GYM_EXERCISE_SET_UPDATED,
  payload,
  meta: {
    exerciseSetId
  },
});

export type GymTrainingAction = 
  | ReturnType<typeof gymTrainingStarted>
  | ReturnType<typeof gymTrainingDurationTick>
  | ReturnType<typeof gymTrainingFinished>
  | ReturnType<typeof gymExerciseSetUpdated>