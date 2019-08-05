import React from 'react';
import { storiesOf } from '@storybook/react-native';
import { InputSearcher } from '.';

storiesOf('InputSearcher', module)
  .add('default', () => (
    <InputSearcher 
      placeholder="Testowy produkt"
      isLoading={true}
    />
  ))