import {
  MEAL_PRODUCT_ADDED,
  PRODUCT_HISTORY_RECENT_ADDED,
  MEAL_ADDED,
} from '../../consts';
import { Product } from '../../../database/entities';
import { ProductHistoryAction } from '../../actions/types/productHistory';
import { filterByUniqueId } from '../../../common/utils';

const getProductsFromAction = (action: ProductHistoryAction): Product[] => {
  switch(action.type) {
    case PRODUCT_HISTORY_RECENT_ADDED: return action.payload;
    case MEAL_PRODUCT_ADDED: return action.meta.rawProduct
      ? [action.meta.rawProduct]
      : [];
    case MEAL_ADDED: 
      const { mealProducts = [] } = action.payload;
      const products = mealProducts.flatMap(mealProduct => mealProduct.product);
      return products;
    default: return [];
  }
}

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