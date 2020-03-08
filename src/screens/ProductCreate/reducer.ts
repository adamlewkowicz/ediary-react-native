import { ProductUnit, BarcodeId } from '../../types';
import { ProductCreateScreenNavigationProps } from '../../navigation';
import { calculateCaloriesByMacro } from '../../common/utils';

export interface ProductCreateState {
  portion: string
  unit: ProductUnit
  portionOptions: {
    title: string
    value: PortionOption
    selected: boolean
  }[]
  portionOption: PortionOption
  productData: {
    name: string
    producer: string
    brand: string
    carbs: string
    sugars: string
    prots: string
    fats: string
    fattyAcids: string
    kcal: string
    barcode: BarcodeId | string
  }
}

export const initialState: ProductCreateState = {
  productData: {
    name: '',
    producer: '',
    brand: '',
    carbs: '',
    sugars: '',
    prots: '',
    fats: '',
    fattyAcids: '',
    kcal: '',
    barcode: '',    
  },
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
  portion: '100',
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
    case 'PRODUCT_DATA_UPDATED': return {
      ...state,
      productData: {
        ...state.productData,
        ...action.payload,
      }
    }
    case 'CALORIES_EVALUATED': 
      const { carbs, prots, fats } = state.productData;
      const calcedKcal = calculateCaloriesByMacro({
        carbs: Number(carbs),
        prots: Number(prots),
        fats: Number(fats)
      });

      console.log({ calcedKcal, state })
      
      return {
        ...state,
        productData: {
          ...state.productData,
          kcal: String(calcedKcal)
        }
      }
    default: return state;
  }
}

export const initProductCreateReducer = (
  { barcode = '', name = '' }: Params
): ProductCreateState => ({
  ...initialState,
  productData: {
    name,
    barcode,
    ...initialState.productData,
  }
});

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
  | { type: 'PRODUCT_DATA_UPDATED', payload: ProductDataPayload }
  | { type: 'CALORIES_EVALUATED' }

type Params = ProductCreateScreenNavigationProps['route']['params'];

export type ProductDataPayload = Partial<ProductCreateState['productData']>;