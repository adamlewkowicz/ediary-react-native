import React from 'react';
import { Text } from 'react-native';
import { DatabaseProvider } from './src/context/database';

const App = () => {
  return (
    <DatabaseProvider>
      <Text>Test</Text>
    </DatabaseProvider>
  );
};

export default App;