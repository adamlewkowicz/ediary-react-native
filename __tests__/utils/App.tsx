import React from 'react';
import { Provider } from 'react-redux';
import { configureStore, Actions, StoreState } from '../../src/store';
import { theme } from '../../src/common/theme';
import { ThemeProvider } from 'styled-components/native';
import { Store } from 'redux';
import { User } from '../../src/database/entities';
import { USER_ID_UNSYNCED } from '../../src/common/consts';
import { render } from '@testing-library/react-native';
import { NavigationContainer, NavigationContext } from '@react-navigation/native';
import { BaseScreenProps } from '../../src/types';

let userMock: User;

beforeEach(async () => {
  userMock = await User.getOrCreate({
    id: USER_ID_UNSYNCED,
    email: null,
    login: 'login',
    password: 'password',
  });
});

export function renderSetup<
  T extends BaseScreenProps,
  Params extends T['route']['params'] = T['route']['params']
>(
  ui: React.ReactElement,
  options?: RenderSetupOptions<Params>
) {
  const navigationCtxMock = createNavigationCtxMock(options?.params);
  const mergedOptions = {
    store: createInitializedStoreMock(options?.initialState),
    ...options
  };
  
  return {
    ...render(
      <Provider store={mergedOptions.store}>
        <ThemeProvider theme={theme}>
          <NavigationContainer>
            <NavigationContext.Provider
              value={createNavigationCtxMock as any}
            >
              {ui}
            </NavigationContext.Provider>
          </NavigationContainer>
        </ThemeProvider>
      </Provider>
    ),
    mocks: {
      navigationContext: navigationCtxMock,
      params: options?.params ?? {} as Params,
    },
  }
}

const createInitializedStoreMock = (initialState?: Partial<StoreState>): Store<StoreState> => {
  const store = configureStore(initialState);

  store.dispatch(
    Actions.userInitialized(userMock)
  );
  
  return store;
}

export const createNavigationCtxMock = <P extends object>(params?: P) => ({
  getParam: jest.fn(),
  navigate: jest.fn(),
  addListener: jest.fn(() => ({ remove: jest.fn() })),
  setParams: jest.fn(),
  isFocused: jest.fn(),
  state: { params },
});

interface RenderSetupOptions<P extends object> {
  initialState?: Partial<StoreState>
  store?: Store<StoreState>
  params?: P
}