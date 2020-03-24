import { ProductUnitType, BarcodeId } from '../../types';
import { ProductCreateScreenNavigationProps } from '../../navigation';
import { Product, IProductRequired } from '../../database/entities';
import * as Utils from '../../utils';

interface ProductData {
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

export interface ProductCreateState {
  portionUnitType: ProductUnitType,
  productData: ProductData
}

export const initialState: ProductCreateState = {
  portionUnitType: 'g',
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
      const calcedKcal = Utils.calculateCaloriesByMacro({
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

export const normalizeProductData = (productData: ProductData) => {
  const { fattyAcids, sugars, ...restData } = productData;

  const macro = {
    carbs: Number(productData.carbs),
    prots: Number(productData.prots),
    fats: Number(productData.fats), 
    kcal: Number(productData.kcal)
  }

  const barcode = productData.barcode.length ? productData.barcode : null;
  const portionQuantity = Number(productData.portionQuantity);
  
  const product = {
    ...restData,
    macro,
    barcode,
    portionQuantity,
  }

  return product;
}

type ProductCreateAction =
  | { type: 'PRODUCT_DATA_UPDATED', payload: ProductDataPayload }
  | { type: 'CALORIES_EVALUATED' }

type Params = ProductCreateScreenNavigationProps['route']['params'];

export type ProductDataPayload = Partial<ProductCreateState['productData']>;