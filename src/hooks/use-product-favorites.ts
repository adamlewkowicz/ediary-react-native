import { useState, useEffect } from 'react';
import { IProduct, Product } from '../database/entities';
import { useUserId } from './use-user-id';
import { useAppError } from './use-app-error';

export const useProductFavorites = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshRequested, setIsRefreshRequested] = useState(true);
  const [products, setProducts] = useState<IProduct[]>([]);
  const { setAppError } = useAppError();
  const userId = useUserId();

  const refresh = () => setIsRefreshRequested(true);

  useEffect(() => {
    const fetchProductFavorites = async () => {
      try {
        setIsLoading(true);

        const result = await Product.findFavorites(userId);

        setProducts(result);

      } catch(error) {
        setAppError(error);

      } finally {
        setIsLoading(false);
        setIsRefreshRequested(false);
      }
    }

    if (isRefreshRequested) {
      fetchProductFavorites();
    }
  }, [userId, isRefreshRequested]);
  
  return { data: products, isLoading, refresh };
}