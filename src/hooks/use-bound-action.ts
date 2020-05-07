import { useDispatch } from 'react-redux'
import { useCallback } from 'react';

export const useBoundAction = <T extends (...args: any[]) => void>(actionCreator: T): T => {
  const dispatch = useDispatch();

  const boundAction = useCallback((...args: any[]) => {
    dispatch(actionCreator(...args));
  }, [dispatch]);

  return boundAction as T;
}