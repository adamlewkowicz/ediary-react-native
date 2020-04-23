import { useSelector } from 'react-redux'
import { Selectors } from '../store'

export const useIsConnected = (): boolean => useSelector(Selectors.getAppIsConnected);