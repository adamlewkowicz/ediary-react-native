import { useState, useEffect } from 'react';
import { useIsConnected } from './use-is-connected';
import { useAppError } from './use-app-error';
import { ProductOrNormalizedProduct, Product } from '../database/entities';
import { BarcodeId } from '../types';

interface ProductSearchState {
  products: ProductOrNormalizedProduct[]
  isLoading: boolean
}

export const useProductSearch = (productName: string, barcode: null | BarcodeId) => {
  const [state, setState] = useState<ProductSearchState>({
    products: [],
    isLoading: false,
  });
  const isConnected = useIsConnected();
  const { setAppError } = useAppError();

  useEffect(() => {
    const trimmedName = productName.trim();

    if (!trimmedName.length) {
      return;
    }

    const controller = new AbortController();
    const methodName = isConnected ? 'findAndFetchByNameLike' : 'findByNameLike';

    const findProductsByName = async (): Promise<void> => {
      try {
        setState(state => ({ ...state, isLoading: true }));

        const products = await Product[methodName](trimmedName, controller);
    
        // TODO: Prevent dispatching products if connection is lost and payload is empty
        setState({ products, isLoading: false });

      } catch(error) {
        setAppError(error, ERROR_MESSAGE);
        setState(state => ({ ...state, isLoading: false }));
      }
    }

    findProductsByName();

    return () => controller.abort();
  }, [productName, isConnected, setAppError]);

  useEffect(() => {
    if (barcode === null || !barcode.length) {
      return;
    }

    const controller = new AbortController();
    const methodName = isConnected ? 'findAndFetchByBarcode' : 'findByBarcode';

    const findProductsByBarcode = async (): Promise<void> => {
      try {
        setState(state => ({ ...state, isLoading: true }));

        const products = await Product[methodName](barcode, controller);

        setState({ isLoading: false, products });

      } catch (error) {
        setAppError(error, ERROR_MESSAGE);
        setState(state => ({ ...state, isLoading: false }));
      }
    }

    findProductsByBarcode();

    return () => controller.abort();
  }, [barcode, isConnected]);

  return { ...state, isConnected };
}

const ERROR_MESSAGE = 'Pobieranie produktów nie powiodło się';