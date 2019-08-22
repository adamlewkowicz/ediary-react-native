import React from 'react';
import { createAppContainer } from 'react-navigation';
import { createHomeStack } from '../../src/navigation';
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
  screen?: Screen
}
export function App({
  initialState,
  store = configureStore(initialState),
  screen = 'Home'
}: AppProps) {
  const HomeStack = createHomeStack(screen);
  const AppContainer = createAppContainer(HomeStack);

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