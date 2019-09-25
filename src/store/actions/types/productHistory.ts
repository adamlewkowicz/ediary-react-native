import { MealProductAdded, MealAdded } from './diary';
import { PRODUCT_HISTORY_RECENT_ADDED } from '../../consts';
import { Product } from '../../../database/entities';

export type ProductHistoryRecentAdded = {
  type: typeof PRODUCT_HISTORY_RECENT_ADDED
  payload: Product[]
}

export type ProductHistoryAction = 
  | MealProductAdded
  | ProductHistoryRecentAdded
  | MealAdded