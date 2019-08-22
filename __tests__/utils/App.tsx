import React from 'react';
import { createAppContainer, createStackNavigator } from 'react-navigation';
import { HomeStack } from '../../src/navigation';
import { Provider } from 'react-redux';
import { AppState, configureStore } from '../../src/store';
import { Screen } from '../../src/types';
import { ApplicationProvider } from 'react-native-ui-kitten';
import { mapping, light as lightTheme } from '@eva-design/eva';
import { themeProps } from '../../src/common/theme';
import { ThemeProvider } from 'styled-components/native';
import { Store } from 'redux';

interface AppProps {
  initialState?: Partial<AppState>
  initialRouteName?: Screen
  store?: Store<AppState>
}
export function App({
  initialRouteName = 'Home',
  initialState,
  store = configureStore(initialState)
}: AppProps) {
  const MainStack = createStackNavigator({
    Home: HomeStack
  }, { initialRouteName });

  const AppContainer = createAppContainer(MainStack);

  return (
    <Provider store={store}>
      <ThemeProvider theme={themeProps}>
        <ApplicationProvider
          mapping={mapping}
          theme={lightTheme}
        >
          <AppContainer />
        </ApplicationProvider>
      </ThemeProvider>
    </Provider>
  );
}