import { useSelector, useDispatch } from 'react-redux';
import { Selectors, Actions } from '../store';
import { Product } from '../database/entities';
import { useEffect } from 'react';

export const useProductHistory = () => {
  const dispatch = useDispatch();
  const { products: data, isAfterFirstFetch } = useSelector(Selectors.getProductHistory);

  useEffect(() => {
    if (!isAfterFirstFetch) {
      dispatch(Actions.productHistoryLoad());
    }
  }, [isAfterFirstFetch]);

  const addProduct = (product: Product): void => {
    dispatch(
      Actions.productHistoryAdded([product])
    );
  }

  return { data, addProduct };
}