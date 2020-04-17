import { useState, useEffect, useCallback } from 'react';
import { useAppError } from './use-app-error';

export const useAsyncTask = <T>(
  initialValue: T,
  promise: () => Promise<T>
) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshRequested, setIsRefreshRequested] = useState(true);
  const [data, setData] = useState<T>(initialValue);
  const { setAppError } = useAppError();

  const refresh = useCallback(() => setIsRefreshRequested(true), []);

  useEffect(() => {
    const handleAsyncTask = async () => {
      try {
        setIsLoading(true);

        const result = await promise();

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