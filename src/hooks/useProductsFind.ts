import { productFindReducer, initialState } from '../screens/ProductFind/reducer';
import { useReducer, useRef, useEffect } from 'react';
import { useCurrentState, useConnected } from '.';
import { Product } from '../database/entities';
import { ABORT_ERROR_NAME } from '../common/consts';
import { BarcodeId } from '../types';


export const useProductsFind = () => {
  const [state, dispatch] = useReducer(productFindReducer, initialState);
  const [isTyping, setIsTyping] = useCurrentState(false);
  const isTypingTimeout = useRef<NodeJS.Timeout>();
  const isConnected = useConnected();

  const onProductNameUpdate = (productName: string): void => {
    clearTimeout(isTypingTimeout.current as NodeJS.Timeout);

    if (!isTyping.current) setIsTyping(true);
    dispatch({ type: 'PRODUCT_NAME_UPDATED', payload: productName });

    isTypingTimeout.current = setTimeout(
      () => setIsTyping(false),
      800
    );
  }

  const onBarcodeUpdate = async (barcode: BarcodeId): Promise<void> => {
    // Imitate typing to prevent searching products by user during barcode search
    setIsTyping(true);
    dispatch({ type: 'BARCODE_SEARCH_STARTED' });

    const methodName = isConnected ? 'findAndFetchByBarcode' : 'findByBarcode';
    const foundProducts = await Product[methodName](barcode);

    dispatch({ type: 'BARCODE_SEARCH_FINISHED', payload: { barcode, foundProducts }});
    setIsTyping(false);
  }

  const onProductCreated = (createdProduct: Product): void => {
    dispatch({ type: 'PRODUCT_CREATED', payload: createdProduct });
  }

  useEffect(() => {
    if (isTyping.current || !state.productName.length) return;

    const controller = new AbortController();
    const trimmedName = state.productName.trim();
    const methodName = isConnected ? 'findAndFetchByNameLike' : 'findByNameLike';

    const findProducts = () => {
      dispatch({ type: 'PRODUCTS_SEARCH_STARTED' });

      Product[methodName](trimmedName, controller)
        .then(payload => {
          if (isTyping.current) return;
          dispatch({ type: 'PRODUCTS_UPDATED', payload });
        })
        .catch(error => {
          if (error.name !== ABORT_ERROR_NAME) {
            throw error;
          }
        })
        .finally(() => dispatch({ type: 'PRODUCTS_SEARCH_FINISHED' }));
    }

    findProducts();

    return () => controller.abort();
  }, [state.productName, isTyping.current, isConnected]);

  return {
    state,
    isConnected,
    isTyping,
    onProductNameUpdate,
    onBarcodeUpdate,
    onProductCreated,
  }
}