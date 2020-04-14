import { IProduct } from '../../../database/entities';
import { ProductFavoritesAction } from '../../actions';
import {
  PRODUCT_FAVORITES_LOADED,
  PRODUCT_FAVORITES_ADDED,
  PRODUCT_FAVORITES_DELETED,
} from '../../consts';

interface ProductFavoritesState {
  products: IProduct[]
  isLoading: boolean
}

const initialState: ProductFavoritesState = {
  products: [],
  isLoading: true,
}

export const productFavoritesReducer = (
  state = initialState,
  action: ProductFavoritesAction
) => {
  switch(action.type) {
    case PRODUCT_FAVORITES_ADDED: return {
      ...state,
      products: [action.payload, ...state.products],
    }
    case PRODUCT_FAVORITES_DELETED: return {
      ...state,
      products: state.products.filter(product => product.id !== action.payload)
    }
    case PRODUCT_FAVORITES_LOADED: return {
      ...state,
      products: action.payload,
      isLoading: false,
    }
    default: return state;
  }
}