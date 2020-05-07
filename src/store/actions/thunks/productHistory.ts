import { Thunk } from '../..';
import { Product } from '../../../database/entities';
import { produtHistoryLoaded } from '../creators/productHistory';

export const productHistoryLoad = (): Thunk => async (dispatch) => {
  const recentProducts = await Product.findRecentlyUsed();

  dispatch(produtHistoryLoaded(recentProducts));
}