import { filterByUniqueId } from '../../../common/utils';
import { Product } from '../../../database/entities';
import { ProductHistoryAction } from '../../actions';
import { getProductsFromAction } from './helpers';

export function productHistoryReducer(
  state: Product[] = [],
  action: ProductHistoryAction
): ProductHistoryState {
  const products = getProductsFromAction(action);
  if (products.length) {
    const maxNumberOfProducts = 8;
    const mergedProducts = [...products, ...state]
      .filter(filterByUniqueId)
      .splice(0, maxNumberOfProducts);
  
    return mergedProducts;
  }
  return state;
}

type ProductHistoryState = Product[];