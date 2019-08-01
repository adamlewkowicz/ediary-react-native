import { ProductUnit, BarcodeId } from '../../types';


export interface FormReducerState {
  name: string
  producer: string
  portion: number
  nutritionFor: '100g' | 'portion' | 'package'
  // unit: ProductUnit
  nutri: any
  carbs: number
  prots: number
  fats: number
  kcal: number
  barcode: BarcodeId
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
  portion: 0,
  carbs: 0,
  prots: 0,
  fats: 0,
  kcal: 0,
  barcode: ''
}

export function formReducer(
  state: FormReducerState,
  action: FormAction,
) {
  switch(action.type) {
    case 'UPDATE': return {
      ...state,
      ...action.payload
    }
    default: return state;
  }
}

type Update = {
  type: 'UPDATE'
  payload: Partial<FormReducerState>
}

type FormAction =
  | Update