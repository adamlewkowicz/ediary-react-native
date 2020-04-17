import { useState, useEffect, useCallback } from 'react';
import { useAppError } from './use-app-error';

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
    const handleAsyncTask = async () => {
      try {
        setIsLoading(true);

        const result = await options.asyncTask();

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
  }, [isRefreshRequested]);
  
  return { data, isLoading, refresh };
}