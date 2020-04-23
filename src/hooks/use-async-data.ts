import { useState, useEffect, useCallback } from 'react';
import { useAppError } from './use-app-error';
import * as Utils from '../utils';

export const useAsyncData = <T>(options: {
  initialValue: T
  asyncTask: () => Promise<T>
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshRequested, setIsRefreshRequested] = useState(true);
  const [data, setData] = useState<T>(options.initialValue);
  const { setAppError } = useAppError();

  const refresh = useCallback(() => setIsRefreshRequested(true), []);

  useEffect(() => {
    const abortController = new AbortController();
    
    const handleAsyncTask = async () => {
      try {
        setIsLoading(true);

        const result = await Utils.cancelablePromise<T>(
          options.asyncTask(),
          abortController
        );

        setData(result);

      } catch(error) {
        setAppError(error);

      } finally {
        setIsLoading(false);
        setIsRefreshRequested(false);
      }
    }

    if (isRefreshRequested) {
      handleAsyncTask();
    }

    return () => abortController.abort();
  }, [isRefreshRequested]);
  
  return { data, isLoading, refresh };
}