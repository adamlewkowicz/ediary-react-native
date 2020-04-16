import { useEffect, useState } from 'react'
import { Product, IProduct } from '../database/entities';
import { useUserId } from './use-user-id';
import { useAppError } from './use-app-error';
import { useIsMountedDebounced } from './use-is-mounted-debounced';

export const useProductsCreated = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [products, setProducts] = useState<IProduct[]>([]);
  const isMountedDebounced = useIsMountedDebounced();
  const userId = useUserId();
  const { setAppError } = useAppError();

  const fetchProductsCreated = async () => {
    try {
      setIsLoading(true);

      const products = await Product.find({ where: { userId }});

      setProducts(products);
      
    } catch(error) {
      setAppError(error);

    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    const fetchProductsCreated = async () => {
      try {
        setIsLoading(true);

        const products = await Product.find({ where: { userId }});
  
        setProducts(products);
        
      } catch(error) {
        setAppError(error);

      } finally {
        setIsLoading(false);
      }
    }

    if (isMountedDebounced) {
      fetchProductsCreated();
    }
  }, [userId, isMountedDebounced]);

  return {
    isLoading,
    data: products,
    refresh: fetchProductsCreated
  };
}