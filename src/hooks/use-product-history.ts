import { useSelector, useDispatch } from 'react-redux';
import { Selectors, Actions } from '../store';
import { Product } from '../database/entities';
import { useEffect } from 'react';

export const useProductHistory = () => {
  const { products: data, isAfterFirstFetch } = useSelector(Selectors.getProductHistory);
  const dispatch = useDispatch();

  useEffect(() => {
    const isNotAfterFirstFetch = !isAfterFirstFetch;

    if (isNotAfterFirstFetch) {
      dispatch(Actions.productHistoryLoad());
    }
  }, [dispatch, isAfterFirstFetch]);

  const addProduct = (product: Product): void => {
    dispatch(
      Actions.productHistoryAdded([product])
    );
  }

  return { data, addProduct, isAfterFirstFetch };
}