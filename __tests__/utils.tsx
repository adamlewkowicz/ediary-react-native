import React from 'react';
import { createAppContainer, createBottomTabNavigator } from 'react-navigation';
import { HomeStack } from '../src/navigation';
import { Provider } from 'react-redux';
import { store, AppState } from '../src/store';
import { Screen } from '../src/types';

interface AppProps {
  initialState?: Partial<AppState>
  initialRouteName?: Screen
}
export function App({ initialRouteName = 'Home' }: AppProps) {
  const MainStack = createBottomTabNavigator({
    Home: HomeStack
  }, { initialRouteName });

  const AppContainer = createAppContainer(MainStack);

  return (
    <Provider store={store}>
      <AppContainer />
    </Provider>
  );
}