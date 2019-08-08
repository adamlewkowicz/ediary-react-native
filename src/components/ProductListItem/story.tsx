import React from 'react';
import { storiesOf } from '@storybook/react-native';
import { ProductListItem } from '.';

storiesOf('ProductListItem', module)
  .add('default', () => (
    <ProductListItem
      phrase="pad"
      product={{
        name: 'Pad Thai',
        carbs: 51,
        prots: 291,
        fats: 102,
        kcal: 861,
        portion: 150
      }}
    />
  ))