import { PRODUCT_HISTORY_ADDED } from '../../consts';
import { Product } from '../../../database/entities';
import { MealProductAdded, MealAdded } from './diary';

export const productHistoryAdded = (products: Product[]) => ({
  type: PRODUCT_HISTORY_ADDED,
  payload: products
});

export type ProductHistoryAction = 
  | ReturnType<typeof productHistoryAdded>
  | MealProductAdded
  | MealAdded