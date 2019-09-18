import React, { useState } from 'react';
import { createAppContainer, NavigationContainer } from 'react-navigation';
import { createMainStack, MainStackScreen } from '../../src/navigation';
import { Provider } from 'react-redux';
import { AppState, configureStore } from '../../src/store';
import { Screen } from '../../src/types';
import { ApplicationProvider } from 'react-native-ui-kitten';
import { mapping, light as lightTheme } from '@eva-design/eva';
import { theme } from '../../src/common/theme';
import { ThemeProvider } from 'styled-components/native';
import { Store } from 'redux';
import { User } from '../../src/database/entities';
import { USER_ID_UNSYNCED } from '../../src/common/consts';
import * as Actions from '../../src/store/actions';

let user: User;
let initialized = false;

beforeEach(async () => {
  initialized = false;
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
}
export function App({
  initialState,
  store = configureStore(initialState),
  screen,
  stack,
}: AppProps) {
  // preserve instance between re-renders
  const [AppContainer] = useState<NavigationContainer>(() => {
    const MainStack = createMainStack(screen, stack);
    const AppContainer = createAppContainer(MainStack);
    return AppContainer;
  });

  if (!initialized) {
    store.dispatch(
      Actions.appInitialized(user)
    );
    initialized = true;
  }

  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
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