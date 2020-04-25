import { Product } from '../database/entities';
import { useUserId } from './use-user-id';
import { useAsyncData } from './use-async-data';

export const useProductFavorites = () => {
  const userId = useUserId();
  const result = useAsyncData<Product[]>({
    initialValue: [],
    asyncTask: () => Product.findFavorites(userId),
  });

  return result;
}