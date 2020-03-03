import { PRODUCT_HISTORY_RECENT_ADDED } from '../../consts';
import { Product } from '../../../database/entities';
import { MealProductAdded, MealAdded } from './diary';

export const productHistoryRecentAdded = (products: Product[]) => ({
  type: PRODUCT_HISTORY_RECENT_ADDED,
  payload: products
});

export type ProductHistoryAction = 
  | ReturnType<typeof productHistoryRecentAdded>
  | MealProductAdded
  | MealAdded