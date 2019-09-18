import React, { ReactNode, useState } from 'react';
import { createAppContainer, NavigationContainer } from 'react-navigation';
import { MainStackScreen, createMainStack } from '../../src/navigation';
import { Provider } from 'react-redux';
import { AppState, configureStore, Actions } from '../../src/store';
import { Screen } from '../../src/types';
import { ApplicationProvider } from 'react-native-ui-kitten';
import { mapping, light as lightTheme } from '@eva-design/eva';
import { theme } from '../../src/common/theme';
import { ThemeProvider } from 'styled-components/native';
import { Store } from 'redux';
import { User } from '../../src/database/entities';
import { USER_ID_UNSYNCED } from '../../src/common/consts';

let user: User;
let isInitialized = false;

beforeEach(async () => {
  isInitialized = false;
  user = await User.getOrCreate({
    id: USER_ID_UNSYNCED,
    email: null,
    login: 'login',
    password: 'password',
  });
});

interface AppProps {
  initialState?: Partial<AppState>
  initialRouteName?: Screen
  store?: Store<AppState>
  screen?: Screen
  stack?: MainStackScreen
  children?: ReactNode
}
export function App({
  initialState,
  store = configureStore(initialState),
  stack,
  screen = 'Home',
  children,
}: AppProps) {
  // preserve instance between re-renders
  const [AppContainer] = useState<NavigationContainer>(() => {
    const MainStack = createMainStack(screen, stack);
    const AppContainer = createAppContainer(MainStack);
    return AppContainer;
  });

  if (!isInitialized) {
    store.dispatch(
      Actions.appInitialized(user)
    );
    isInitialized = true;
  }

  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <ApplicationProvider
          mapping={mapping}
          theme={lightTheme}
        >
          {children ? children : <AppContainer />}
        </ApplicationProvider>
      </ThemeProvider>
    </Provider>
  );
}