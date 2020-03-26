import React from 'react';
import { storiesOf } from '@storybook/react-native';
import { SelectionBox } from '.';
import { WomanIcon } from '../Icons';

storiesOf('SelectionBox', module)
  .add('default', () => (
    <SelectionBox
      isActive={true}
      onChange={() => {}}
      title="Kobieta"
      Icon={WomanIcon}
    />
  ))