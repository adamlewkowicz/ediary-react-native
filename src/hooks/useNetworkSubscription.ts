import { useEffect } from 'react'
import NetInfo from '@react-native-community/netinfo';
import { Actions } from '../store';
import { useDispatch } from 'react-redux';

export const useNetworkSubscription = (): void => {
  const dispatch = useDispatch();

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      dispatch(
        Actions.appConnectionStatusUpdated(state.isConnected)
      );
    });

    return () => unsubscribe();
  }, [dispatch]);
}