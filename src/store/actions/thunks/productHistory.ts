import { Thunk } from '../..';
import { Product } from '../../../database/entities';
import { productHistoryAdded } from '../creators/productHistory';

export const productHistoryLoad = (): Thunk => async (dispatch) => {
  const recentProducts = await Product.findRecentlyUsed();
  if (recentProducts.length) {
    dispatch(productHistoryAdded(recentProducts));
  }
}