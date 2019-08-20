import { useSelector } from 'react-redux';
import { StoreState } from '../../store';

export function useConnected(): boolean {
  const isConnected = useSelector((state: StoreState) => 
    state.application.isConnected
  );
  return isConnected;
}