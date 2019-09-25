import { Thunk } from '../..';
import { Product } from '../../../database/entities';
import { productHistoryRecentLoaded } from '../creators/productHistory';

export const productHistoryRecentLoad = (): Thunk => async (dispatch) => {
  const recentProducts = await Product.findRecentlyUsed();
  if (recentProducts.length) {
    dispatch(productHistoryRecentLoaded(recentProducts));
  }
}