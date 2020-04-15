import { ProductId } from '../types';
import { useEffect, useState } from 'react';
import { ProductFavorite } from '../database/entities';
import { useUserId } from './use-user-id';

export const useIsFavoriteProduct = (productId: ProductId) => {
  const [isFavorite, setIsFavorite] = useState<null | boolean>(null);
  const userId = useUserId();

  useEffect(() => {
    const checkProductFavorite = async () => {
      const isFavoriteStatus = await ProductFavorite.isFavorite(productId, userId);

      setIsFavorite(isFavoriteStatus);
    }

    checkProductFavorite();
  }, [productId, userId]);

  return isFavorite;
}