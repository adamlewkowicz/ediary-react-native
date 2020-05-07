import { useEffect, useCallback } from 'react';
import { useAppError } from './use-app-error';
import * as Utils from '../utils';
import { useNativeState } from './use-native-state';

interface State<T> {
  isLoading: boolean
  isRefreshRequested: boolean
  data: T
}

export const useAsyncData = <T>(options: {
  initialValue: T
  asyncTask: () => Promise<T>
}) => {
  const [state, setState] = useNativeState<State<T>>({
    isLoading: false,
    isRefreshRequested: false,
    data: options.initialValue,
  });
  const { setAppError } = useAppError();

  const refresh = useCallback(() => setState({ isRefreshRequested: true }), []);

  useEffect(() => {
    const abortController = new AbortController();
    
    const handleAsyncTask = async () => {
      try {
        setState({ isLoading: true });

        const data = await Utils.cancelablePromise<T>(
          options.asyncTask(),
          abortController
        );

        setState({
          data,
          isLoading: false,
          isRefreshRequested: false,
        });

      } catch(error) {
        setAppError(error);

        setState({
          isLoading: false,
          isRefreshRequested: false,
        });
      }
    }

    if (state.isRefreshRequested) {
      handleAsyncTask();
    }

    return () => abortController.abort();
  }, [state.isRefreshRequested]);
  
  return { ...state, refresh };
}