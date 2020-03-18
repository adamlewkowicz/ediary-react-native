import { useSelector, useDispatch } from 'react-redux';
import { Selectors, Actions } from '../store';
import { Product } from '../database/entities';

export const useProductHistory = () => {
  const dispatch = useDispatch();
  const data = useSelector(Selectors.getProductHistory);

  const addProduct = (product: Product): void => {
    dispatch(
      Actions.productHistoryRecentAdded([product])
    );
  }

  return { data, addProduct };
}