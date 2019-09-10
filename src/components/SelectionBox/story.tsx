import React from 'react';
import { storiesOf } from '@storybook/react-native';
import { SelectionBox } from '.';
import { WomanIcon } from '../Icons';
import { theme } from '../../common/theme';

storiesOf('SelectionBox', module)
  .add('default', () => (
    <SelectionBox
      value={true}
      onChange={() => {}}
      title="Kobieta"
      icon={(
        <WomanIcon
          fill={theme.color.focus}
          width={45}
          height={45}
        />
      )}
    />
  ))