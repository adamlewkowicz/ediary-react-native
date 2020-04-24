import { Product } from '../../../database/entities';
import { ProductHistoryAction } from '../../actions';
import { getProductsFromAction } from './helpers';
import { PRODUCT_HISTORY_LOADED } from '../../consts';
import * as Utils from '../../../utils';

interface ProductHistoryState {
  products: Product[]
  isLoaded: boolean
}

const initialState: ProductHistoryState = {
  products: [],
  isLoaded: false,
}

export function productHistoryReducer(
  state = initialState,
  action: ProductHistoryAction
): ProductHistoryState {
  const extractedProducts = getProductsFromAction(action);
  const isLoaded = state.isLoaded ? true : action.type === PRODUCT_HISTORY_LOADED;

  if (extractedProducts.length) {
    const maxNumberOfProducts = 8;
    
    const products = [...extractedProducts, ...state.products]
      .filter(Utils.filterByUniqueId)
      .splice(0, maxNumberOfProducts);

    return { products, isLoaded };
  }

  return { ...state, isLoaded };
}