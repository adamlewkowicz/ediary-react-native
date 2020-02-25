import React from 'react';
import { Provider } from 'react-redux';
import { configureStore, Actions, StoreState } from '../../src/store';
import { theme } from '../../src/common/theme';
import { ThemeProvider } from 'styled-components/native';
import { Store } from 'redux';
import { User } from '../../src/database/entities';
import { USER_ID_UNSYNCED } from '../../src/common/consts';
import { render } from '@testing-library/react-native';
import { NavigationContainer, NavigationContext, NavigationRouteContext } from '@react-navigation/native';
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
  options: RenderSetupOptions<Params> = {}
) {
  const { initialState, params = {}, store } = options;
  const storeMock = store ?? createInitializedStoreMock(initialState);
  const navigationCtxMock = createNavigationCtxMock(params);
  
  return {
    ...render(
      <Provider store={storeMock}>
        <ThemeProvider theme={theme}>
          <NavigationContainer>
            <NavigationContext.Provider value={navigationCtxMock as any}>
              <NavigationRouteContext.Provider value={{ params } as any}>
                {ui}
              </NavigationRouteContext.Provider>
            </NavigationContext.Provider>
          </NavigationContainer>
        </ThemeProvider>
      </Provider>
    ),
    mocks: {
      navigationContext: navigationCtxMock,
      params,
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

const createNavigationCtxMock = <P extends object>(params?: P) => ({
  getParam: jest.fn(),
  navigate: jest.fn(),
  addListener: jest.fn(() => jest.fn()),
  setParams: jest.fn(),
  isFocused: jest.fn(),
  state: { params },
  setOptions: jest.fn(),
});

interface RenderSetupOptions<P extends object> {
  initialState?: Partial<StoreState>
  store?: Store<StoreState>
  params?: P
}