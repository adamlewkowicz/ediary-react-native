import { Product, IProduct } from '../database/entities';
import { useUserId } from './use-user-id';
import { useAsyncData } from './use-async-data';

export const useProductsCreated = () => {
  const userId = useUserId();
  const result = useAsyncData<IProduct[]>({
    initialValue: [],
    asyncTask: () => Product.findOwn(userId),
  });

  return result;
}