import { ProductOrNormalizedProduct, Product } from '../../database/entities';
import { BarcodeId } from '../../types';

interface ProductFindState {
  productName: string
  barcode: BarcodeId | null
  isTyping: boolean
  isLoading: boolean
  products: ProductOrNormalizedProduct[]
}

export const initialState: ProductFindState = {
  productName: '',
  barcode: null,
  isTyping: false,
  isLoading: false,
  products: []
}

export const productFindReducer = (
  state: ProductFindState,
  action: ProductFindAction
): ProductFindState => {
  switch(action.type) {
    case 'PRODUCT_NAME_UPDATED': return {
      ...state,
      productName: action.payload,
      isTyping: true,
    }
    case 'TYPING_FINISHED': return {
      ...state,
      isTyping: false,
      isLoading: true,
    }
    case 'PRODUCTS_UPDATED': 
      if (state.isTyping) return state;

      return {
        ...state,
        isLoading: false,
        products: action.payload
      }
    case 'PRODUCTS_SEARCH_FINISHED': 
      if (state.isLoading === false) return state;

      return { ...state, isLoading: false };
    case 'PRODUCT_CREATED': return {
      ...state,
      barcode: null,
      products: [action.payload],
      isLoading: false,
    }
    case 'BARCODE_SEARCH_STARTED': return {
      ...state,
      productName: '',
      products: [],
      isLoading: true,
      // Imitate typing to prevent searching products by user during barcode search
      isTyping: true
    }
    case 'BARCODE_SEARCH_FINISHED': {
      const { foundProducts: products, barcode } = action.payload;
      const genericReturn = { ...state, isLoading: false, isTyping: false };

      if (products.length) {
        return { ...genericReturn, products };
      }

      return { ...genericReturn, barcode };
    }
  }
}

type ProductFindAction =
  | { type: 'PRODUCT_NAME_UPDATED', payload: string }
  | { type: 'TYPING_FINISHED' }
  | { type: 'PRODUCTS_UPDATED', payload: ProductOrNormalizedProduct[] }
  | { type: 'PRODUCTS_SEARCH_FINISHED' }
  | { type: 'PRODUCT_CREATED', payload: Product }
  | { type: 'BARCODE_SEARCH_STARTED' }
  | { type: 'BARCODE_SEARCH_FINISHED', payload: { barcode: BarcodeId, foundProducts: Product[] }}