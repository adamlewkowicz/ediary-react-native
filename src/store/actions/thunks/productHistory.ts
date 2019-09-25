import { Thunk } from '../..';
import { Product } from '../../../database/entities';
import { productHistoryRecentAdded } from '../creators/productHistory';

export const productHistoryRecentLoad = (): Thunk => async (dispatch) => {
  const recentProducts = await Product.findRecentlyUsed();
  if (recentProducts.length) {
    dispatch(productHistoryRecentAdded(recentProducts));
  }
}