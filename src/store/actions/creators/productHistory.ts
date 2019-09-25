import { PRODUCT_HISTORY_RECENT_ADDED } from '../../consts';
import { Product } from '../../../database/entities';

export const productHistoryRecentAdded = (products: Product[]) => ({
  type: PRODUCT_HISTORY_RECENT_ADDED,
  payload: products
});