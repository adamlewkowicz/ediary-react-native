import React, { ReactNode, useState } from 'react';
import { createAppContainer, NavigationContainer, NavigationContext } from 'react-navigation';
import { MainStackScreen, createMainStack } from '../../src/navigation';
import { Provider } from 'react-redux';
import { configureStore, Actions, StoreState } from '../../src/store';
import { Screen } from '../../src/types';
import { ApplicationProvider } from 'react-native-ui-kitten';
import { mapping, light as lightTheme } from '@eva-design/eva';
import { theme } from '../../src/common/theme';
import { ThemeProvider } from 'styled-components/native';
import { Store } from 'redux';
import { User } from '../../src/database/entities';
import { USER_ID_UNSYNCED } from '../../src/common/consts';
import { render } from '@testing-library/react-native';

let user: User;
let isInitialized = false;

const createNavigationCtxMock = <P extends object>(params?: P) => ({
  getParam: jest.fn(),
  navigate: jest.fn(),
  addListener: jest.fn(),
  setParams: jest.fn(),
  state: { params }
});

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
  initialState?: Partial<StoreState>
  initialRouteName?: Screen
  store?: Store<StoreState>
  screen?: Screen
  stack?: MainStackScreen
  children?: ReactNode
  navigationContext?: any
}
export function App({
  initialState,
  store = configureStore(initialState),
  stack,
  screen = 'Home',
  children,
  navigationContext = createNavigationCtxMock()
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
          <NavigationContext.Provider value={navigationContext}>
            {children ? children : <AppContainer />}
          </NavigationContext.Provider>
        </ApplicationProvider>
      </ThemeProvider>
    </Provider>
  );
}

export function renderSetup<P extends object>(
  ui: React.ReactElement,
  options?: RenderSetupOptions<P>
) {
  const navigationCtxMock = createNavigationCtxMock(options?.params);
  const mergedOptions = {
    store: configureStore(options?.initialState),
    ...options
  };
  return {
    ...render(
      <App
        navigationContext={navigationCtxMock}
        store={mergedOptions.store}
      >
        {ui}
      </App>
    ),
    mocks: {
      navigationContext: navigationCtxMock,
      params: options?.params || {} as P
    },
  }
}

interface RenderSetupOptions<P extends object> {
  initialState?: Partial<StoreState>
  store?: Store<StoreState>
  params?: P
}