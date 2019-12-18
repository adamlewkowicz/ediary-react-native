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
} from '../../consts';
import { GymTrainingAction } from '../../actions/creators/gymTraining';
import { ExerciseSetState } from './types';
import { ExerciseState } from '../../../mobx/GymTrainingStore';
import { normalizeExercise, normalizeExerciseSet } from '../../../mobx/utils';

interface GymTrainingState {
  duration: number
  isPaused: boolean
  isFinished: boolean

  activeExerciseSet: ExerciseSetState | null
  activeExerciseSetId: 4

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
}

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
  state: GymTrainingState,
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