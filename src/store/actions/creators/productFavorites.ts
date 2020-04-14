import { Product } from '../../../database/entities';
import { PRODUCT_FAVORITES_LOADED, PRODUCT_FAVORITES_ADDED } from '../../consts';

export const productFavoritesAdded = (product: Product) => ({
  type: PRODUCT_FAVORITES_ADDED,
  payload: product,
});

export const productFavoritesLoaded = (products: Product[]) => ({
  type: PRODUCT_FAVORITES_LOADED,
  payload: products,
});

export type ProductFavoritesAction = 
  | ReturnType<typeof productFavoritesAdded>
  | ReturnType<typeof productFavoritesLoaded>