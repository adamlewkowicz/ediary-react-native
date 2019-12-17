import React, { createContext, ReactNode } from 'react';
import { RootStore } from '../mobx';

const rootStore = new RootStore();

export const MobxStoreContext = createContext(rootStore);

interface MobxStoreProvider {
  children: ReactNode
}

export const MobxStoreProvider = (props: MobxStoreProvider) => {
  return (
    <MobxStoreContext.Provider value={rootStore}>
      {props.children}
    </MobxStoreContext.Provider>
  );
}
