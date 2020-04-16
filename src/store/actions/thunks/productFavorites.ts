import { Thunk } from '../../store';
import { UserId, ProductId } from '../../../types';
import { User, ProductFavorite, IProduct } from '../../../database/entities';
import {
  productFavoritesLoaded,
  productFavoritesAdded,
  productFavoritesDeleted,
  productFavoritesToggled,
} from '../creators';

export const productFavoritesLoad = (
  userId: UserId
): Thunk => async (dispatch) => {
  const products = await User.findProductFavorites(userId);
  
  dispatch(productFavoritesLoaded(products));
}

export const productFavoritesAdd = (
  product: IProduct,
  userId: UserId
): Thunk => async (dispatch) => {
  await ProductFavorite.save({ userId, productId: product.id });

  dispatch(productFavoritesAdded(product));
}

export const productFavoritesToggle = (
  product: IProduct,
  userId: UserId,
): Thunk => async (dispatch) => {
  const { isFavorite } = await ProductFavorite.toggleFavorite(product.id, userId);

  dispatch(productFavoritesToggled(product, isFavorite));
}

export const productFavoritesDelete = (
  productId: ProductId,
  userId: UserId
): Thunk => async (dispatch) => {
  await ProductFavorite.delete({ userId, productId });

  dispatch(productFavoritesDeleted(productId));
}