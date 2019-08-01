import { ProductUnit, BarcodeId } from '../../types';

export interface ProductCreateState {
  name: string
  producer: string
  portion: number
  unit: ProductUnit
  portionOptions: {
    title: string
    value: PortionOption
    selected: boolean
  }[]
  portionOption: PortionOption
  carbs: number
  prots: number
  fats: number
  kcal: number
  barcode: BarcodeId | string
  mealId: null
}

export const initialState: ProductCreateState = {
  name: '',
  producer: '',
  portionOptions: [
    {
      title: '100g',
      value: '100g',
      selected: true
    },
    {
      title: 'porcję',
      value: 'portion',
      selected: false
    },
    {
      title: 'opakowanie',
      value: 'package',
      selected: false
    }
  ],
  portionOption: '100g',
  unit: 'g',
  portion: 0,
  carbs: 0,
  prots: 0,
  fats: 0,
  kcal: 0,
  barcode: '',
  mealId: null
}

export function productCreateReducer(
  state: ProductCreateState,
  action: ProductCreateAction,
): ProductCreateState {
  switch(action.type) {
    case 'UPDATE': return {
      ...state,
      ...action.payload
    }
    case 'SELECT_PORTION_OPTION': return {
      ...state,
      portionOptions: state.portionOptions.map(option => ({
        ...option,
        selected: option.value === action.payload
      })),
      portionOption: action.payload
    }
    default: return state;
  }
}

export type PortionOption = '100g' | 'portion' | 'package';

type Update = {
  type: 'UPDATE'
  payload: Partial<ProductCreateState>
}

type SelectPortionOption = {
  type: 'SELECT_PORTION_OPTION'
  payload: PortionOption
}

type ProductCreateAction =
  | Update
  | SelectPortionOption