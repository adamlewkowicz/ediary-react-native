import { ProductUnit } from '../../types';


export interface FormReducerState {
  name: string
  producer: string
  quantity: number
  nutritionFor: '100g' | 'portion' | 'package'
  // unit: ProductUnit
  nutri: any
  carbs: number
  prots: number
  fats: number
  kcal: number
}

export const initialState: FormReducerState = {
  name: '',
  producer: '',
  nutritionFor: '100g',
  nutri: [
    {
      text: '100g',
      value: false
    }
  ],
  quantity: 0,
  carbs: 0,
  prots: 0,
  fats: 0,
  kcal: 0,
}

export function formReducer(
  state: FormReducerState,
  action: FormAction,
) {
  switch(action.type) {
    case 'UPDATE_PROPERTY': return {
      ...state,
      [action.meta.key]: action.payload
    }
    case 'UPDATE': return {
      ...state,
      ...action.payload
    }
    default: return state;
  }
}

type UpdateProperty = {
  type: 'UPDATE_PROPERTY'
  payload: string | number
  meta: {
    key: keyof FormReducerState
  }
}

type Update = {
  type: 'UPDATE'
  payload: Partial<FormReducerState>
}

type FormAction =
  | UpdateProperty
  | Update