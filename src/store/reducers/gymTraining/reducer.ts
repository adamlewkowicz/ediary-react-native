// import { GymTrainingState } from './types';
import { GYM_DURATION_TICK, GYM_TRAINING_STARTED } from '../../consts';
import { GymTrainingAction } from '../../actions/creators/gymTraining';
import { ExerciseSetState } from './types';

interface GymTrainingState {
  duration: number
  isPaused: boolean
  isFinished: boolean

  activeExerciseSet: ExerciseSetState | null
  activeExerciseSetId: 4

  exercises: Exercise[]
  sets: ExerciseSetState[]
}

const initialState = {
  duration: 0,
  // isPaused: 
  state: 'inactive' | 'paused' | 'unpaused',
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

export function gymTrainingReducer(
  state: GymTrainingState,
  action: GymTrainingAction
) {
  switch(action.type) {
    case GYM_TRAINING_STARTED: return {
      ...state,
      isActive: true,
    }
    case GYM_DURATION_TICK: 
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
  }
} 