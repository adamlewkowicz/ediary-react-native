import { ProductUnit, BarcodeId } from '../../types';
import { ProductCreateScreenNavigationProps } from '../../navigation';
import { calculateCaloriesByMacro } from '../../common/utils';

export interface ProductCreateState {
  portionUnit: ProductUnit,
  productData: {
    name: string
    producer: string
    brand: string
    portionQuantity: string
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
  portionUnit: 'g',
  productData: {
    name: '',
    producer: '',
    brand: '',
    portionQuantity: '',
    carbs: '',
    sugars: '',
    prots: '',
    fats: '',
    fattyAcids: '',
    kcal: '',
    barcode: '',    
  },
}

export function productCreateReducer(
  state: ProductCreateState,
  action: ProductCreateAction,
): ProductCreateState {
  switch(action.type) {
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

type ProductCreateAction =
  | { type: 'PRODUCT_DATA_UPDATED', payload: ProductDataPayload }
  | { type: 'CALORIES_EVALUATED' }

type Params = ProductCreateScreenNavigationProps['route']['params'];

export type ProductDataPayload = Partial<ProductCreateState['productData']>;