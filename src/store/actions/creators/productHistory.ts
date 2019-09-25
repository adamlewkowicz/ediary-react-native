import { PRODUCT_HISTORY_RECENT_LOADED } from '../../consts';
import { Product } from '../../../database/entities';

export const productHistoryRecentLoaded = (products: Product[]) => ({
  type: PRODUCT_HISTORY_RECENT_LOADED,
  payload: products
});

export type ProductHistoryRecentLoaded = ReturnType<typeof productHistoryRecentLoaded>;