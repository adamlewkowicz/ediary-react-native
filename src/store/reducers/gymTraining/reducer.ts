// import { GymTrainingState } from './types';
import {
  GYM_TRAINING_DURATION_TICK,
  GYM_TRAINING_STARTED,
  GYM_EXERCISE_SET_UPDATED,
  GYM_EXERCISE_SET_DELETED,
  GYM_EXERCISE_SET_ADDED,
  GYM_EXERCISE_ADDED,
  GYM_EXERCISE_UPDATED,
  GYM_EXERCISE_DELETED,
  GYM_TRAINING_ADDED,
  GYM_TRAINING_UPDATED,
  GYM_TRAINING_DELETED,
  GYM_EXERCISE_SET_ACTIVATED,
  GYM_EXERCISE_SET_REST_ACTIVATED,
} from '../../consts';
import { GymTrainingAction } from '../../actions/creators/gymTraining';
import { ExerciseSetState } from './types';
import { ExerciseState, TrainingState } from '../../../mobx/GymTrainingStore';
import { normalizeExercise, normalizeExerciseSet, normalizeTrainings } from '../../../mobx/utils';
import { ExerciseSetId } from '../../../types';
import { findById } from '../../../common/utils';

interface GymTrainingState {
  duration: number
  isPaused: boolean
  isFinished: boolean

  // redundant - requires to store info about item in multiple places
  activeExerciseSet: ExerciseSetState | null
  activeExerciseSetId: ExerciseSetId

  trainings: TrainingState[]
  exercises: ExerciseState[]
  sets: ExerciseSetState[]

  exerciseSets: ExerciseSetState[]
}

const initialState = {
  duration: 0,
  // isPaused: 
  // state: 'inactive' | 'paused' | 'unpaused',
  trainings: [
    {
      id: 1,
      name: 'Plecy, nogi',
      isActive: true,
      exercises: [
        {
          id: 1,
          name: 'Martwy ciąg',
          breakDuration: 20,
          sets: [
            {
              id: 1,
              repeats: 12,
              loadWeight: 20,
              breakDuration: 20
            }
          ]
        }
      ]
    }
  ],
  // exercises: [],
  // sets: []
} as any;

type ItemWithId<ID> = { id: ID }

const updateById = <ID, T extends ItemWithId<ID>>(
  items: T[],
  itemId: ID,
  callback: (item: T) => T
): T[] => {
  return items.map(item => {
    if (item.id === itemId) {
      return callback(item);
    }
    return item;
  });
}

const removeById = <ID, T extends ItemWithId<ID>>(
  items: T[],
  itemId: ID
): T[] => {
  return items.filter(item => item.id !== itemId);
}

export function gymTrainingReducer(
  state: GymTrainingState = initialState,
  action: GymTrainingAction
): GymTrainingState {
  switch(action.type) {
    case GYM_TRAINING_STARTED: return {
      ...state,
    }
    case GYM_TRAINING_DURATION_TICK: 
      const { activeExerciseSet } = state;

      if (activeExerciseSet !== null) {
        return {
          ...state,
          activeExerciseSet: {
            ...activeExerciseSet,
            duration: activeExerciseSet.duration + 1
          }
        }
      }
      return state;
    case GYM_EXERCISE_SET_REST_ACTIVATED: return {
      ...state,
      exerciseSets: state.exerciseSets.map(exerciseSet => {
        if (exerciseSet.state === 'active') {
          return { ...exerciseSet, isRest: true };
        }
        return exerciseSet;
      })
    }
    case 'GYM_EXERCISE_SET_DISACTIVATED': return {
      ...state,
      exerciseSets: state.exerciseSets.map(exerciseSet => {
        if (exerciseSet.state === 'active') {
          return { ...exerciseSet, state: 'finished', isRest: false };
        }
        return exerciseSet;
      })
    }
    case GYM_EXERCISE_SET_ACTIVATED:
      const { exerciseSetId } = action.meta;

      if (exerciseSetId) {
        const foundExerciseSet = findById(state.exerciseSets, exerciseSetId);
       
        if (foundExerciseSet) {

        }
      }

      const nextExerciseSet = state.exerciseSets.find(
        exerciseSet => exerciseSet.state === 'unfinished'
      );

      if (nextExerciseSet) {
        return {
          ...state,
          exerciseSets: state.exerciseSets.map(exerciseSet => {
            const isActive = exerciseSet.state === 'active';
            const isUnfinished = exerciseSet.id === nextExerciseSet.id &&
              exerciseSet.state === 'unfinished';

            if (isActive) {
              return { ...exerciseSet, state: 'finished', isRest: false };
            }

            if (isUnfinished) {
              return { ...exerciseSet, state: 'active' };
            }

            return exerciseSet;
          })
        }
      }

      return state;
    case GYM_TRAINING_ADDED: {
      const { trainings, exerciseSets, exercises } = normalizeTrainings([action.payload]);

      return {
        ...state,
        trainings: [...state.trainings, ...trainings],
        exercises: [...state.exercises, ...exercises],
        exerciseSets: [...state.exerciseSets, ...exerciseSets],
      }
    }
    case GYM_TRAINING_UPDATED: return {
      ...state,
      trainings: updateById(
        state.trainings,
        action.meta.trainingId,
        training => ({ ...training, ...action.payload })
      )
    }
    /** TODO: delete exercise sets */
    case GYM_TRAINING_DELETED: return {
      ...state,
      trainings: state.trainings.filter(
        training => training.id !== action.meta.trainingId
      ),
      exercises: state.exercises.filter(
        exercise => exercise.trainingId !== action.meta.trainingId
      )
    }
    case GYM_EXERCISE_ADDED:
      const { exercise, exerciseSets } = normalizeExercise(action.payload);

      return {
        ...state,
        exercises: [...state.exercises, exercise],
        exerciseSets: [...state.exerciseSets, ...exerciseSets]
      }
    case GYM_EXERCISE_UPDATED: return {
      ...state,
      exercises: updateById(
        state.exercises,
        action.meta.exerciseId,
        exercise => ({ ...exercise, ...action.payload })
      )
    }
    case GYM_EXERCISE_DELETED: return {
      ...state,
      exercises: state.exercises.filter(
        exercise => exercise.id !== action.meta.exerciseId
      ),
      exerciseSets: state.exerciseSets.filter(
        set => set.exerciseId !== action.meta.exerciseId
      )
    }
    case GYM_EXERCISE_SET_UPDATED: return {
      ...state,
      exerciseSets: state.exerciseSets.map(set => {
        if (set.id === action.meta.exerciseSetId) {
          return { ...set, ...action.payload };
        }
        return set;
      })
    }
    case GYM_EXERCISE_SET_ADDED:
      const exerciseSet = normalizeExerciseSet(action.payload);

      return {
        ...state,
        exercises: updateById(
          state.exercises,
          action.meta.exerciseId,
          exercise => ({
            ...exercise,
            setIds: [...exercise.setIds, action.payload.id]
          })
        ),
        exerciseSets: [...state.exerciseSets, exerciseSet]
      }
    case GYM_EXERCISE_SET_UPDATED: return {
      ...state,
      exerciseSets: updateById(
        state.exerciseSets,
        action.meta.exerciseSetId,
        exerciseSet => ({ ...exerciseSet, ...action.payload })
      )
    }
    case GYM_EXERCISE_SET_DELETED: return {
      ...state,
      exercises: updateById(
        state.exercises,
        action.meta.exerciseSetId,
        exercise => ({
          ...exercise,
          setIds: exercise.setIds.filter(
            setId => setId !== action.meta.exerciseSetId
          )
        })
      ),
      exerciseSets: removeById(
        state.exerciseSets,
        action.meta.exerciseId
      ),
    }
    default: return state;
  }
}

// POC

interface BaseActiveTrainingState {
  activeExerciseSetId: number | null
  exerciseSetState: ExerciseSetState['state'] | null
}

interface ActiveTraining_active extends BaseActiveTrainingState {
  activeExerciseSetId: number
  exerciseSetState: ExerciseSetState['state']
}

interface ActiveTraining_unactive extends BaseActiveTrainingState {
  activeExerciseSetId: null
  exerciseSetState: null
}

type ActiveTrainingState = ActiveTraining_active | ActiveTraining_unactive

const activeTrainingState: ActiveTrainingState = {
  activeExerciseSetId: 1,
  exerciseSetState: 'active',
}