import React from 'react';
import { render } from '@testing-library/react-native';
import { App } from '../../../__tests__/utils';
import { Product } from '../../database/entities';
import { configureStore } from '../../store';

test('renders recently used products in list', async () => {
  const productMock = await Product.save({ name: 'Fish' });
  // store has to be mocked, since recent products are fetched on home screen and
  // after interactions has been finished
  const storeMock = configureStore({
    productHistory: [productMock]
  });

  const { findByText } = render(
    <App
      screen="ProductFind"
      store={storeMock}
    />
  );

  await findByText(productMock.name);
});