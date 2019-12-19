import { Thunk, Selectors } from '../..';
import {
  gymTrainingDurationTick,
  gymTrainingStarted,
  gymTrainingFinished,
  gymExerciseSetUpdated,
  gymExerciseSetActivated,
} from '../creators/gymTraining';
import { batch } from 'react-redux';
import { ExerciseSetId } from '../../../types';

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

export const gymTrainingFinish: Thunk<void> = () => (dispatch) => {
  // TODO: finish training - save results to db
  clearInterval(durationInterval);
  dispatch(gymTrainingFinished);
}