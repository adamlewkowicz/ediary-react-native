import {
  GYM_TRAINING_STARTED,
  GYM_TRAINING_DURATION_TICK,
  GYM_TRAINING_FINISHED,
  GYM_EXERCISE_ADDED,
  GYM_EXERCISE_UPDATED,
  GYM_EXERCISE_DELETED,
  GYM_EXERCISE_SET_UPDATED,
  GYM_EXERCISE_SET_DELETED,
  GYM_EXERCISE_SET_ADDED,
  GYM_TRAINING_ADDED,
  GYM_TRAINING_UPDATED,
  GYM_TRAINING_DELETED,
  GYM_EXERCISE_SET_ACTIVATED,
} from '../../consts';
import { ExerciseSetId, ExerciseId, TrainingId } from '../../../types';
import { ExerciseSetState } from '../../reducers/gymTraining/types';
import { ExerciseState, TrainingState } from '../../../mobx/GymTrainingStore';
import { Exercise, ExerciseSet, Training } from '../../../database/entities';

export const gymTrainingStarted = () => ({
  type: GYM_TRAINING_STARTED
});

export const gymTrainingDurationTick = () => ({
  type: GYM_TRAINING_DURATION_TICK
});

export const gymTrainingFinished = () => ({
  type: GYM_TRAINING_FINISHED
});

export const gymTrainingAdded = (training: Training) => ({
  type: GYM_TRAINING_ADDED,
  payload: training,
});

export const gymTrainingUpdated = (
  trainingId: TrainingId,
  training: Partial<TrainingState>
) => ({
  type: GYM_TRAINING_UPDATED,
  payload: training,
  meta: { trainingId }
});

export const gymTrainingDeleted = (trainingId: TrainingId) => ({
  type: GYM_TRAINING_DELETED,
  meta: { trainingId }
});

export const gymExerciseAdded = (
  trainingId: TrainingId,
  exercise: Exercise,
) => ({
  type: GYM_EXERCISE_ADDED,
  payload: exercise,
  meta: {
    trainingId
  }
});

export const gymExerciseUpdated = (
  exerciseId: ExerciseId,
  exercise: Partial<ExerciseState>
) => ({
  type: GYM_EXERCISE_UPDATED,
  payload: exercise,
  meta: {
    exerciseId
  },
});

export const gymExerciseDeleted = (
  trainingId: TrainingId,
  exerciseId: ExerciseId,
) => ({
  type: GYM_EXERCISE_DELETED,
  meta: {
    trainingId,
    exerciseId
  }
});

export const gymExerciseSetAdded = (
  exerciseId: ExerciseId,
  exerciseSet: ExerciseSet
) => ({
  type: GYM_EXERCISE_SET_ADDED,
  payload: exerciseSet,
  meta: {
    exerciseId
  },
});

export const gymExerciseSetUpdated = (
  exerciseSetId: ExerciseSetId,
  exerciseSet: Partial<ExerciseSetState>
) => ({
  type: GYM_EXERCISE_SET_UPDATED,
  payload: exerciseSet,
  meta: {
    exerciseSetId
  },
});

export const gymExerciseSetDeleted = (
  exerciseId: ExerciseId,
  exerciseSetId: ExerciseSetId
) => ({
  type: GYM_EXERCISE_SET_DELETED,
  meta: {
    exerciseId,
    exerciseSetId
  }
});

export const gymExerciseSetActivated = (
  exerciseSetId?: ExerciseSetId
) => ({
  type: GYM_EXERCISE_SET_ACTIVATED,
  meta: {
    exerciseSetId
  }
});

export type GymTrainingAction = 
  | ReturnType<typeof gymTrainingStarted>
  | ReturnType<typeof gymTrainingDurationTick>
  | ReturnType<typeof gymTrainingFinished>
  | ReturnType<typeof gymTrainingAdded>
  | ReturnType<typeof gymTrainingUpdated>
  | ReturnType<typeof gymTrainingDeleted>
  | ReturnType<typeof gymExerciseAdded>
  | ReturnType<typeof gymExerciseUpdated>
  | ReturnType<typeof gymExerciseDeleted>
  | ReturnType<typeof gymExerciseSetAdded>
  | ReturnType<typeof gymExerciseSetUpdated>
  | ReturnType<typeof gymExerciseSetDeleted>
  | ReturnType<typeof gymExerciseSetActivated>