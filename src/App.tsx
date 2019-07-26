import React from 'react';
import { DatabaseProvider } from './context/Database';
import { Home } from './pages/Home';
import { mapping, light as lightTheme } from '@eva-design/eva';
import { ApplicationProvider } from 'react-native-ui-kitten';

export const App = () => {
  return (
    <DatabaseProvider>
      <ApplicationProvider
        mapping={mapping}
        theme={lightTheme}
      >
        <Home />
      </ApplicationProvider>
    </DatabaseProvider>
  );
};