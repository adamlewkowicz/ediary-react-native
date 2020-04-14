import { Product } from '../../../database/entities';
import { ProductFavoritesAction } from '../../actions';
import {
  PRODUCT_FAVORITES_LOADED,
  PRODUCT_FAVORITES_ADDED,
} from '../../consts';

interface ProductFavoritesState {
  products: Product[]
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
      products: [action.payload, ...state.products]
    }
    case PRODUCT_FAVORITES_LOADED: return {
      ...state,
      products: action.payload
    }
    default: return state;
  }
}