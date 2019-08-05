import React from 'react';
import { storiesOf } from '@storybook/react-native';
import { PhraseSelector } from '.';

storiesOf('PhraseSelector', module)
  .add('default', () => (
    <PhraseSelector
      value="Interstellar"
      phrase="inter"
      fontSize={16}
    />
  ))