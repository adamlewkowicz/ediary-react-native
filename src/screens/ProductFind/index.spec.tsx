import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { App, renderSetup } from '../../../__tests__/utils';
import { Product } from '../../database/entities';
import { configureStore } from '../../store';
import { ProductFind } from '.';

describe('<ProductFind />', () => {

  describe('when searches for product 🔎', () => {

    it('should display found products', async () => {
      const productMock = await Product.save({ name: 'tomatoe' });
      const ctx = renderSetup(<ProductFind />);
  
      const productFindInput = ctx.getByLabelText('Nazwa szukanego produktu');
      fireEvent.changeText(productFindInput, productMock.name);

      await ctx.findByText(productMock.name);
    });

  });



});

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