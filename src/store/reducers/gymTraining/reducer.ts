import { GymTrainingState } from './types';
import { GYM_DURATION_TICK } from '../../consts';

const initialState: GymTrainingState = {
  exercises: [],
  sets: []
}

export function gymTrainingReducer(
  state: GymTrainingState,
  action: 
) {
  switch(action.type) {
    case GYM_DURATION_TICK: return {
      ...state,
      
    }
  }
} 