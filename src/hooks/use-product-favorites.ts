import { useSelector, useDispatch } from 'react-redux';
import { Selectors, Actions } from '../store';
import { useCallback } from 'react';
import { UserId } from '../types';
import { Product } from '../database/entities';

export const useProductFavorites = () => {
  const { products: data } = useSelector(Selectors.getProductFavorites);
  const dispatch = useDispatch();

  const addProduct = useCallback((product: Product, userId: UserId) => {
    dispatch(
      Actions.productFavoritesAdd(product, userId)
    );
  }, [dispatch]);

  return { data, addProduct };
}