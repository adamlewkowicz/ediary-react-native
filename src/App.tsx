import React from 'react';
import { Provider as ReduxProvider } from 'react-redux';
import { store } from './store';
import { ThemeProvider } from 'styled-components/native';
import { theme } from './common/theme';
import { RootStack } from './navigation/RootStack';

export const App = () => (
  <ReduxProvider store={store}>
    <ThemeProvider theme={theme}>
      <RootStack />
    </ThemeProvider>
  </ReduxProvider>
);