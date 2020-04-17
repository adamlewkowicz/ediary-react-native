import { Product, IProduct } from '../database/entities';
import { useUserId } from './use-user-id';
import { useAsyncTask } from './use-async-task';

export const useProductsCreated = () => {
  const userId = useUserId();
  const result = useAsyncTask<IProduct[]>(
    [],
    () => Product.findOwn(userId)
  );

  return result;
}