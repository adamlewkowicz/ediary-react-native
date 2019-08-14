import React from 'react';
import { Home } from './pages/Home';
import { mapping, light as lightTheme } from '@eva-design/eva';
import { ApplicationProvider } from 'react-native-ui-kitten';
import { Provider } from 'react-redux';
import { configureStore } from './store';
import { ThemeProvider } from 'styled-components/native';
import { themeProps } from './common/theme';
import { ProductCreate } from './pages/ProductCreate';
import { ProductFinder } from './pages/ProductFinder';
import { AppContainer } from './navigation';
import { ProfileCreator } from './pages/ProfileCreator';

const store = configureStore();

export const App = () => {
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
};