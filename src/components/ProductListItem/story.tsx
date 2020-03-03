import React from 'react';
import { storiesOf } from '@storybook/react-native';
import { ProductListItemMemo } from '.';

storiesOf('ProductListItem', module)
  .add('default', () => (
    <ProductListItemMemo
      product={{
        name: 'Pad Thai',
        macro: {
          carbs: 51,
          prots: 291,
          fats: 102,
          kcal: 861,
        },
        portion: 150
      }}
      onPress={() => {}}
    />
  ))