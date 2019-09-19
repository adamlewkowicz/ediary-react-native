import { MobxStoreContext } from '../../context/MobxStore';
import { useContext } from 'react';
import { RootStore } from '../../store/mobx';
import { useObserver } from 'mobx-react';

export function useMobxStore<S>(
  storeSelector: (store: RootStore) => S
): RootStore {
  const rootStore = useContext(MobxStoreContext);
  
  if (!rootStore) {
    throw new Error(
      'Mobx store provider has not been passed'
    );
  }

  return rootStore;
  // return useObserver(() => storeSelector(rootStore));
}