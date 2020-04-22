import { ProductId } from '../types';
import { useEffect, useState, useCallback } from 'react';
import { ProductFavorite } from '../database/entities';
import { useUserId } from './use-user-id';

export const useProductFavorite = (productId: ProductId) => {
  const [isFavorite, setIsFavorite] = useState<null | boolean>(null);
  const userId = useUserId();

  useEffect(() => {
    const checkProductFavorite = async () => {
      const isFavoriteStatus = await ProductFavorite.isFavorite(productId, userId);

      setIsFavorite(isFavoriteStatus);
    }

    checkProductFavorite();
  }, [productId, userId]);

  const toggle = useCallback(async () => {
    const result = await ProductFavorite.toggleFavorite(productId, userId);

    setIsFavorite(result.isFavorite);
  }, [productId, userId]);

  return { isFavorite, toggle };
}