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
    setIsFavorite(isFavorite => !isFavorite);
    await ProductFavorite.toggleFavorite(productId, userId);
  }, [productId, userId]);

  return { isFavorite, toggle };
}