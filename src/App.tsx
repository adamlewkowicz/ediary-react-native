import React from 'react';
import { Provider as ReduxProvider } from 'react-redux';
import { store } from './store';
import { ThemeProvider } from 'styled-components/native';
import { THEME } from './common/theme';
import { RootStack } from './navigation/RootStack';
import { IntlProvider } from './context/IntlContext';

export const App = () => (
  <IntlProvider>
    <ReduxProvider store={store}>
      <ThemeProvider theme={THEME}>
        <RootStack />
      </ThemeProvider>
    </ReduxProvider>
  </IntlProvider>
);