import React from 'react';
import { Provider as StoreProvider } from 'react-redux';
import { store } from './store';
import { ThemeProvider } from 'styled-components/native';
import { THEME } from './common/theme';
import { RootStack } from './navigation/RootStack';

export const App = () => (
  <StoreProvider store={store}>
    <ThemeProvider theme={THEME}>
      <RootStack />
    </ThemeProvider>
  </StoreProvider>
);