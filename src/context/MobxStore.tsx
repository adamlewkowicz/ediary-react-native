import React, { ReactNode } from 'react';
import { RootStore, rootStore } from '../store/mobx';

export const MobxStoreContext = React.createContext<null | RootStore>(null);

interface MobxStoreProviderProps {
  children: ReactNode
}
export const MobxStoreProvider = (props: MobxStoreProviderProps) => (
  <MobxStoreContext.Provider value={rootStore}>
    {props.children}
  </MobxStoreContext.Provider>
);