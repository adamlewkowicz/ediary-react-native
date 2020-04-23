import { Product } from '../../../database/entities';
import { ProductHistoryAction } from '../../actions';
import { getProductsFromAction } from './helpers';
import { PRODUCT_HISTORY_ADDED } from '../../consts';
import * as Utils from '../../../utils';

interface ProductHistoryState {
  products: Product[]
  isAfterFirstFetch: boolean
}

const initialState: ProductHistoryState = {
  products: [],
  isAfterFirstFetch: false,
}

export function productHistoryReducer(
  state = initialState,
  action: ProductHistoryAction
): ProductHistoryState {
  const extractedProducts = getProductsFromAction(action);

  if (extractedProducts.length) {
    const maxNumberOfProducts = 8;
    const isAfterFirstFetch = action.type === PRODUCT_HISTORY_ADDED;
    
    const products = [...extractedProducts, ...state.products]
      .filter(Utils.filterByUniqueId)
      .splice(0, maxNumberOfProducts);

    return { products, isAfterFirstFetch };
  }

  return state;
}