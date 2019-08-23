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
}
export function App({
  initialState,
  store = configureStore(initialState),
  screen = 'Home'
}: AppProps) {
  const HomeStack = createHomeStack(screen);
  const AppContainer = createAppContainer(HomeStack);

  if (!initialized) {
    store.dispatch(
      Actions.appInitialized(user)
    );
    initialized = true;
  }

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