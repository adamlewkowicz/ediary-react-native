import { IProduct, Product } from '../database/entities';
import { useUserId } from './use-user-id';
import { useAsyncTask } from './use-async-task';

export const useProductFavorites = () => {
  const userId = useUserId();
  const result = useAsyncTask<IProduct[]>(
    [],
    () => Product.findFavorites(userId)
  );

  return result;
}