import { useContext } from 'react';
import { RootStore } from '../mobx';
import { MobxStoreContext } from '../context/MobxStore';

export function useMobxStore(): RootStore {
  return useContext(MobxStoreContext);
}