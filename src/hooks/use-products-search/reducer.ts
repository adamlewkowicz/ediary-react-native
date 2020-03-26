import { ProductOrNormalizedProduct, Product } from '../../database/entities';
import { BarcodeId } from '../../types';

interface ProductsSearchState {
  productName: string
  barcode: BarcodeId | null
  products: ProductOrNormalizedProduct[]
  isSearching: boolean
  isTyping: boolean
  isDirty: boolean
}

export const initialState: ProductsSearchState = {
  productName: '',
  barcode: null,
  products: [],
  isSearching: false,
  isTyping: false,
  isDirty: false,
}

export const productsSearchReducer = (
  state: ProductsSearchState,
  action: ProductsSearchAction
): ProductsSearchState => {
  switch(action.type) {
    case 'PRODUCT_NAME_UPDATED':
      const productName = action.payload;
      const isDirty = productName.length === 0 ? false : state.isDirty;

      return {
        ...state,
        isTyping: true,
        isDirty,
        productName,
      }
    case 'PRODUCTS_SEARCH_STARTED': return {
      ...state,
      isSearching: true
    }
    case 'PRODUCTS_SEARCH_SUCCEEDED': return {
      ...state,
      isSearching: false,
      isTyping: false,
      isDirty: true,
      products: action.payload,
    }
    case 'PRODUCTS_SEARCH_FINISHED':
    case 'BARCODE_SEARCH_FINISHED':
      if (!state.isSearching) return state;

      return { ...state, isSearching: false };
    case 'PRODUCT_CREATED': return {
      ...state,
      barcode: null,
      products: [action.payload],
      isSearching: false,
    }
    case 'BARCODE_UPDATED': return {
      ...state,
      barcode: action.payload
    }
    case 'BARCODE_SEARCH_STARTED': return {
      ...state,
      productName: '',
      products: [],
      isSearching: true,
    }
    case 'BARCODE_SEARCH_SUCCEEDED': return {
      ...state,
      ...action.payload,
      isSearching: false,
      isDirty: true,
    }
  }
}

type ProductsSearchAction =
  | { type: 'PRODUCT_NAME_UPDATED', payload: string }
  | { type: 'PRODUCTS_SEARCH_STARTED' }
  | { type: 'PRODUCTS_SEARCH_SUCCEEDED', payload: ProductOrNormalizedProduct[] }
  | { type: 'PRODUCTS_SEARCH_FINISHED' }
  | { type: 'PRODUCT_CREATED', payload: Product }
  | { type: 'BARCODE_UPDATED', payload: BarcodeId }
  | { type: 'BARCODE_SEARCH_STARTED' }
  | { type: 'BARCODE_SEARCH_SUCCEEDED', payload: { barcode: BarcodeId, products: Product[] }}
  | { type: 'BARCODE_SEARCH_FINISHED' }