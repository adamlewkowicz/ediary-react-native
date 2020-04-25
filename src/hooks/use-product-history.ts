import { useSelector, useDispatch } from 'react-redux';
import { Selectors, Actions } from '../store';
import { Product } from '../database/entities';
import { useEffect, useCallback } from 'react';

export const useProductHistory = () => {
  const { products: data, isLoaded } = useSelector(Selectors.getProductHistory);
  const dispatch = useDispatch();
  const isLoading = !isLoaded;

  useEffect(() => {
    if (!isLoaded) {
      dispatch(Actions.productHistoryLoad());
    }
  }, [dispatch, isLoaded]);

  const addProduct = useCallback((product: Product): void => {
    dispatch(
      Actions.productHistoryAdded([product])
    );
  }, [dispatch]);

  return { data, addProduct, isLoading };
}