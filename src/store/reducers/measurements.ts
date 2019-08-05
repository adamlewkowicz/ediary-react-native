import { MacroElements, WeightGoal } from '../../types';
import { MEAS_DATA_UPDATED } from '../consts';
import { MeasurementActions } from '../actions';
import { formulaRatio, kcalRatio } from '../helpers/measurements';

const initialState: MeasurementsState = {
  weight: null,
  age: null,
  gender: null,
  weightGoal: 'maintain',
  macroNeeds: {
    carbs: 0,
    prots: 0,
    fats: 0,
    kcal: 0
  }
}

export function measurementsReducer(
  state = initialState,
  action: MeasurementActions
): MeasurementsState {
  switch(action.type) {
    case MEAS_DATA_UPDATED: 
      const nextState = { ...state, ...action.payload };
      if (state.weight === null) return nextState;
      
      const ratio = formulaRatio[state.weightGoal];

      const carbs = Math.round(ratio.carbs * state.weight);
      const prots = Math.round(ratio.prots * state.weight);
      const fats = Math.round(ratio.fats * state.weight);
      const kcal = Math.round(
        kcalRatio.carbs * carbs +
        kcalRatio.prots * prots +
        kcalRatio.fats * fats
      );

      const macroNeeds = { carbs, prots, fats, kcal };
      return { ...nextState, macroNeeds }
    default: return state;
  }
}

export interface MeasPayload {
  weight: number | null
  age: number | null
  gender: 'male' | 'female' | null
  weightGoal: WeightGoal
}

export interface MeasurementsState extends MeasPayload {
  macroNeeds: MacroElements
}