import { IProduct } from '../../../database/entities';
import {
  PRODUCT_FAVORITES_LOADED,
  PRODUCT_FAVORITES_ADDED,
  PRODUCT_FAVORITES_DELETED,
  PRODUCT_FAVORITES_TOGGLED,
} from '../../consts';
import { ProductId } from '../../../types';

export const productFavoritesAdded = (product: IProduct) => ({
  type: PRODUCT_FAVORITES_ADDED,
  payload: product,
});

export const productFavoritesDeleted = (productId: ProductId) => ({
  type: PRODUCT_FAVORITES_DELETED,
  payload: productId,
});

export const productFavoritesLoaded = (products: IProduct[]) => ({
  type: PRODUCT_FAVORITES_LOADED,
  payload: products,
});

export const productFavoritesToggled = (product: IProduct, isFavorite: boolean) => ({
  type: PRODUCT_FAVORITES_TOGGLED,
  payload: product,
  meta: { isFavorite }
});

export type ProductFavoritesAction = 
  | ReturnType<typeof productFavoritesAdded>
  | ReturnType<typeof productFavoritesLoaded>
  | ReturnType<typeof productFavoritesDeleted>
  | ReturnType<typeof productFavoritesToggled>