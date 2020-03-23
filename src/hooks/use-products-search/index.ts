import { useReducer, useEffect } from 'react';
import { Product } from '../../database/entities';
import { ABORT_ERROR_NAME } from '../../common/consts';
import { BarcodeId } from '../../types';
import { productsSearchReducer, initialState } from './reducer';
import { useDebouncedValue } from '..';
import { useSelector } from 'react-redux';
import { Selectors } from '../../store';

export const useProductsSearch = () => {
  const [state, dispatch] = useReducer(productsSearchReducer, initialState);
  const debouncedProductName = useDebouncedValue(state.productName, 800);
  const isConnected = useSelector(Selectors.getAppIsConnected);

  const updateProductName = (productName: string): void => {
    dispatch({ type: 'PRODUCT_NAME_UPDATED', payload: productName });
  }

  const addProduct = (createdProduct: Product): void => {
    dispatch({ type: 'PRODUCT_CREATED', payload: createdProduct });
  }

  const updateBarcode = (barcode: BarcodeId): void => {
    dispatch({ type: 'BARCODE_UPDATED', payload: barcode });
  }

  useEffect(() => {
    if (!debouncedProductName.length) return;

    const controller = new AbortController();
    const trimmedName = debouncedProductName.trim();
    const methodName = isConnected ? 'findAndFetchByNameLike' : 'findByNameLike';

    const findProductsByName = async (): Promise<void> => {
      try {
        dispatch({ type: 'PRODUCTS_SEARCH_STARTED' });

        const payload = await Product[methodName](trimmedName, controller);
    
        // TODO: Prevent dispatching products if connection is lost and payload is empty
        dispatch({ type: 'PRODUCTS_SEARCH_SUCCEEDED', payload });

      } catch(error) {
        if (error.name !== ABORT_ERROR_NAME) {
          throw error;
        }
      } finally {
        dispatch({ type: 'PRODUCTS_SEARCH_FINISHED' });
      }
    }

    findProductsByName();

    return () => controller.abort();
  }, [debouncedProductName, isConnected]);

  useEffect(() => {
    const { barcode } = state;
    if (barcode === null || !barcode.length) return;

    const controller = new AbortController();
    const methodName = isConnected ? 'findAndFetchByBarcode' : 'findByBarcode';

    const findProductsByBarcode = async (): Promise<void> => {
      try {
        dispatch({ type: 'BARCODE_SEARCH_STARTED' });

        const products = await Product[methodName](barcode, controller);

        dispatch({ type: 'BARCODE_SEARCH_SUCCEEDED', payload: { barcode, products }});

      } catch (error) {
        if (error.name !== ABORT_ERROR_NAME) {
          throw error;
        }
      } finally {
        dispatch({ type: 'BARCODE_SEARCH_FINISHED' });
      }
    }

    findProductsByBarcode();

    return () => controller.abort();
  }, [state.barcode, isConnected]);

  return {
    state,
    isConnected,
    updateProductName,
    updateBarcode,
    addProduct,
    debouncedProductName,
  }
}