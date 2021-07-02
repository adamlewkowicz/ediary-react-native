import { PRODUCT_HISTORY_ADDED, PRODUCT_HISTORY_LOADED } from '../../consts';
import { Product } from '../../../database/entities';
import { MealProductAdded, MealAdded } from './diary';

export const productHistoryAdded = (products: Product[]) => ({
  type: PRODUCT_HISTORY_ADDED,
  payload: products
});

export const produtHistoryLoaded = (products: Product[]) => ({
  type: PRODUCT_HISTORY_LOADED,
  payload: products
});

// export type ProductHistoryAction = 
//   | ReturnType<typeof productHistoryAdded>
//   | ReturnType<typeof produtHistoryLoaded>
//   | MealProductAdded
//   | MealAdded