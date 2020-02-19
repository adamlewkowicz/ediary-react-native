import { productFindReducer, initialState } from '../screens/ProductFind/reducer';
import { useReducer, useRef, useEffect } from 'react';
import { useCurrentState, useConnected } from '.';
import { Product } from '../database/entities';
import { ABORT_ERROR_NAME } from '../common/consts';
import { BarcodeId } from '../types';
import { useDebouncedValue } from './useDebouncedValue';


export const useProductsFind = () => {
  const [state, dispatch] = useReducer(productFindReducer, initialState);
  const debouncedProductName = useDebouncedValue(state.productName, 800);
  const isConnected = useConnected();

  const onProductNameUpdate = (productName: string): void => {
    dispatch({ type: 'PRODUCT_NAME_UPDATED', payload: productName });
  }

  const onBarcodeUpdate = async (barcode: BarcodeId): Promise<void> => {
    // Imitate typing to prevent searching products by user during barcode search
    dispatch({ type: 'BARCODE_SEARCH_STARTED' });

    const methodName = isConnected ? 'findAndFetchByBarcode' : 'findByBarcode';
    const foundProducts = await Product[methodName](barcode);

    dispatch({ type: 'BARCODE_SEARCH_FINISHED', payload: { barcode, foundProducts }});
  }

  const onProductCreated = (createdProduct: Product): void => {
    dispatch({ type: 'PRODUCT_CREATED', payload: createdProduct });
  }


  useEffect(() => {
    if (!debouncedProductName.length) return;

    const controller = new AbortController();
    const trimmedName = debouncedProductName.trim();
    const methodName = isConnected ? 'findAndFetchByNameLike' : 'findByNameLike';

    const findProducts = async (): Promise<void> => {
      try {
        dispatch({ type: 'PRODUCTS_SEARCH_STARTED' });

        const payload = await Product[methodName](trimmedName, controller);
    
        dispatch({ type: 'PRODUCTS_UPDATED', payload });

      } catch(error) {
        if (error.name !== ABORT_ERROR_NAME) {
          throw error;
        }

      } finally {
        dispatch({ type: 'PRODUCTS_SEARCH_FINISHED' });
      }
    }

    findProducts();

    return () => controller.abort();
  }, [debouncedProductName, isConnected]);

  return {
    state,
    isConnected,
    onProductNameUpdate,
    onBarcodeUpdate,
    onProductCreated,
    debouncedProductName,
  }
}