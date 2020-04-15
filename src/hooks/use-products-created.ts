import { useEffect, useState } from 'react'
import { Product, IProduct } from '../database/entities';
import { useUserId } from './use-user-id';
import { useAppError } from './use-app-error';

export const useProductsCreated = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [products, setProducts] = useState<IProduct[]>([]);
  const userId = useUserId();
  const appError = useAppError();

  useEffect(() => {
    const fetchProductsCreated = async () => {
      try {
        setIsLoading(true);

        const products = await Product.find({ where: { userId }});
  
        setProducts(products);
      } catch(error) {
        appError.setAppError(error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchProductsCreated();
  }, [userId, appError]);

  return { isLoading, data: products };
}