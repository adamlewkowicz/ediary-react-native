import { useSelector, useDispatch } from 'react-redux';
import { Selectors, Actions } from '../store';
import { useCallback } from 'react';
import { Product } from '../database/entities';
import { useUserId } from './use-user-id';
import { ProductId } from '../types';

export const useProductFavorites = () => {
  const { products } = useSelector(Selectors.getProductFavorites);
  const userId = useUserId();
  const dispatch = useDispatch();

  const addProduct = useCallback((product: Product) => {
    dispatch(
      Actions.productFavoritesAdd(product, userId)
    );
  }, [dispatch, userId]);

  const deleteProduct = useCallback((productId: ProductId) => {
    dispatch(
      Actions.productFavoritesDelete(productId, userId)
    );
  }, [dispatch, userId]);

  return {
    data: products,
    add: addProduct,
    delete: deleteProduct,
  };
}