import { Product } from '../../../database/entities';
import { ProductHistoryAction } from '../../actions/types/productHistory';
import { MEAL_PRODUCT_ADDED, PRODUCT_HISTORY_RECENT_LOADED } from '../../consts';
import { filterByUniqueId } from '../../../common/utils';

const getProductsFromAction = (action: ProductHistoryAction): Product[] => {
  if (action.type === MEAL_PRODUCT_ADDED) {
    return action.meta.rawProduct ? [action.meta.rawProduct] : [];
  } else if (action.type === PRODUCT_HISTORY_RECENT_LOADED) {
    return action.payload;
  }
  return [];
}

export function productHistoryReducer(
  state: Product[] = [],
  action: ProductHistoryAction
): ProductHistoryState {
  const products = getProductsFromAction(action);
  const maxNumberOfProducts = 8;
  const mergedProducts = [...state, ...products]
    .filter(filterByUniqueId)
    .splice(0, maxNumberOfProducts);

  return mergedProducts;
}

type ProductHistoryState = Product[];