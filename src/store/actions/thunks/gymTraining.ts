import { Thunk, Selectors } from '../..';
import {
  gymTrainingDurationTick,
  gymTrainingStarted,
  gymTrainingFinished,
  gymExerciseSetUpdated,
  gymExerciseSetActivated,
  gymExerciseSetAdded,
  gymExerciseSetDeleted,
  gymExerciseDeleted,
} from '../creators/gymTraining';
import { batch } from 'react-redux';
import { ExerciseSetId, ExerciseId, TrainingId } from '../../../types';
import {
  ExerciseSet,
  Exercise,
  IExerciseSetRequired,
} from '../../../database/entities';

let durationInterval: NodeJS.Timeout;

export const gymTrainingStart: Thunk<void> = () => (dispatch) => {
  dispatch(gymTrainingStarted());

  durationInterval = setInterval(() => {
    dispatch(gymTrainingDurationTick());
  }, 1000);
}

export const gymExerciseSetActivate: Thunk<void> = (
  exerciseSetId?: ExerciseSetId
) => (dispatch, getState) => {
  const state = getState();
  const nextExerciseSet = Selectors.getNextExerciseSet(state);
  const activeExerciseSet = Selectors.getActiveExerciseSet(state);

  if (nextExerciseSet && activeExerciseSet) {
    batch(() => {
      dispatch(
        gymExerciseSetUpdated(
          activeExerciseSet.id, { state: 'finished', isRest: false }
        )
      );
      dispatch(
        gymExerciseSetUpdated(nextExerciseSet.id, { state: 'active' })
      );
    });
    // v2 - more logic in reducer
    dispatch(gymExerciseSetActivated(exerciseSetId));
  } else {
    dispatch(gymTrainingFinish());
  }
}

export const gymExerciseSetAdd: Thunk = (
  exerciseId: ExerciseId,
  prevExerciseSet?: IExerciseSetRequired
) => async (dispatch) => {
  const exerciseSet = await ExerciseSet.save({ ...prevExerciseSet });

  dispatch(gymExerciseSetAdded(exerciseId, exerciseSet));
}

export const gymExerciseSetDelete: Thunk = (
  exerciseId: ExerciseId,
  exerciseSetId: ExerciseSetId
) => async (dispatch) => {
  dispatch(gymExerciseSetDeleted(exerciseId, exerciseSetId));

  await ExerciseSet.delete(exerciseSetId as number);
}

export const gymExerciseDelete: Thunk = (
  trainingId: TrainingId,
  exerciseId: ExerciseId
) => async (dispatch) => {
  dispatch(gymExerciseDeleted(trainingId, exerciseId));

  await Exercise.delete(exerciseId as number);
}

export const gymTrainingFinish: Thunk<void> = () => (dispatch) => {
  // TODO: finish training - save results to db
  clearInterval(durationInterval);
  dispatch(gymTrainingFinished);
}