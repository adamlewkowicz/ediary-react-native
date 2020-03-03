import {
  MEAL_PRODUCT_ADDED,
  PRODUCT_HISTORY_RECENT_ADDED,
  MEAL_ADDED,
} from '../../consts';
import { Product } from '../../../database/entities';
import { ProductHistoryAction } from '../../actions';

export const getProductsFromAction = (action: ProductHistoryAction): Product[] => {
  switch(action.type) {
    case PRODUCT_HISTORY_RECENT_ADDED:
      return action.payload;
    case MEAL_PRODUCT_ADDED:
      if (action.meta.rawProduct) {
        return [action.meta.rawProduct];
      }
    case MEAL_ADDED: 
      const { mealProducts = [] } = action.payload;
      const products = mealProducts.flatMap(mealProduct => mealProduct.product);
      return products;
    default:
      return [];
  }
}