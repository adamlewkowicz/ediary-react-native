import { Thunk } from '../../store';
import { UserId } from '../../../types';
import { User, Product, ProductFavorite } from '../../../database/entities';
import { productFavoritesLoaded, productFavoritesAdded } from '../creators';

export const productFavoritesLoad = (userId: UserId): Thunk => async (dispatch) => {
  const products = await User.findProductFavorites(userId);
  
  dispatch(productFavoritesLoaded(products));
}

export const productFavoritesAdd = (
  userId: UserId, product: Product
): Thunk => async (dispatch) => {
  await ProductFavorite.save({ userId, productId: product.id });

  dispatch(productFavoritesAdded(product));
}