import { ProductOrNormalizedProduct } from '../../database/entities';

interface ProductFindState {
  productName: string
  isTyping: boolean
  isLoading: boolean
  products: ProductOrNormalizedProduct[]
}

export const initialState: ProductFindState = {
  productName: '',
  isTyping: false,
  isLoading: false,
  products: []
}

export const productFindReducer = (
  state: ProductFindState,
  action: ProductFindAction
): ProductFindState => {
  switch(action.type) {
    case 'product_name_updated': return {
      ...state,
      productName: action.payload,
      isTyping: true,
    }
    case 'typing_finished': return {
      ...state,
      isTyping: false,
      isLoading: true,
    }
    case 'products_updated': 
      if (state.isTyping) return state;

      return {
        ...state,
        isLoading: false,
        products: action.payload
      }
  }
}

type ProductFindAction =
  | { type: 'product_name_updated', payload: string }
  | { type: 'typing_finished' }
  | { type: 'products_updated', payload: ProductOrNormalizedProduct[] }