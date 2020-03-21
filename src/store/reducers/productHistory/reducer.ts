import { filterByUniqueId } from '../../../common/utils';
import { IProduct } from '../../../database/entities';
import { ProductHistoryAction } from '../../actions';
import { getProductsFromAction } from './helpers';
import { PRODUCT_HISTORY_RECENT_ADDED } from '../../consts';

interface ProductHistoryState {
  products: IProduct[]
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
    const isAfterFirstFetch = !state.isAfterFirstFetch && action.type === PRODUCT_HISTORY_RECENT_ADDED;
    
    const products = [...extractedProducts, ...state.products]
      .filter(filterByUniqueId)
      .splice(0, maxNumberOfProducts);

    return { products, isAfterFirstFetch };
  }

  return state;
}