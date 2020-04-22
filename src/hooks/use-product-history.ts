import { useSelector, useDispatch } from 'react-redux';
import { Selectors, Actions } from '../store';
import { Product } from '../database/entities';
import { useEffect } from 'react';

export const useProductHistory = () => {
  const { products: data, isAfterFirstFetch: isLoading } = useSelector(Selectors.getProductHistory);
  const dispatch = useDispatch();
  const isNotAfterFirstFetch = !isLoading;

  useEffect(() => {
    if (isNotAfterFirstFetch) {
      dispatch(Actions.productHistoryLoad());
    }
  }, [dispatch, isNotAfterFirstFetch]);

  const addProduct = (product: Product): void => {
    dispatch(
      Actions.productHistoryAdded([product])
    );
  }

  return { data, addProduct, isLoading: isNotAfterFirstFetch };
}