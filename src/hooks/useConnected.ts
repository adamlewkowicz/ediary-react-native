import { useSelector } from 'react-redux';
import { Selectors } from '../store';

export function useConnected(): boolean {
  const isConnected = useSelector(Selectors.getIsConnected);
  return isConnected;
}