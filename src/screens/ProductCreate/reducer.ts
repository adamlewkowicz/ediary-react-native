import { PortionUnit, BarcodeId } from '../../types';
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
  portionUnitType: PortionUnit,
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

export const normalizeProductData = (productData: ProductData): IProductRequired => {
  const {
    carbs, prots, fats, kcal,
    portionQuantity,
    fattyAcids, sugars,
    barcode,
    ...restData
  } = productData;

  const macro = {
    carbs: Number(carbs),
    prots: Number(prots),
    fats: Number(fats), 
    kcal: Number(kcal)
  }

  const normalizedBarcode = barcode.length ? barcode : null;

  const normalizedPortion = Number(portionQuantity);

  if (
    !Number.isNaN(normalizedPortion) &&
    normalizedPortion > 0 &&
    normalizedPortion !== Product.defaultPortion
  ) {
    return {
      macro,
      barcode: normalizedBarcode,
      portions: [
        {
          type: 'portion',
          value: normalizedPortion
        }
      ],
      ...restData,
    }
  } 

  return { macro, barcode: normalizedBarcode, ...restData };
}

type ProductCreateAction =
  | { type: 'PRODUCT_DATA_UPDATED', payload: ProductDataPayload }
  | { type: 'CALORIES_EVALUATED' }

type Params = ProductCreateScreenNavigationProps['route']['params'];

export type ProductDataPayload = Partial<ProductCreateState['productData']>;