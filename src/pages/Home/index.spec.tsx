import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import productMock from '../../../__tests__/data/product';
import { App } from '../../../__tests__/utils';

test('toggling meal shows meal details', async () => {
  const { findByLabelText } = render(
    <App />
  );

  const mealButton = await findByLabelText('Pokaż szczegóły posiłku');
  fireEvent.press(mealButton);

});

test('searching by name and adding product to meal', async () => {
  const productName = productMock.name;

  const { findByLabelText, findByPlaceholderText, queryByText } = render(
    <App />
  );

  const mealButton = await findByLabelText('Pokaż szczegóły posiłku');
  fireEvent.press(mealButton);

  const addProductNavButton = await findByLabelText('Wyszukaj produkt do posiłku');
  fireEvent.press(addProductNavButton);

  // check if page changed to ProductFinder

  const searcherInput = await findByPlaceholderText('Nazwa produktu');
  fireEvent.press(searcherInput);
  fireEvent.changeText(searcherInput, productName);

  const foundProductButton = await findByLabelText('Dodaj produkt do posiłku');
  fireEvent.press(foundProductButton);

  // check if page changed to Home

  expect(queryByText(productName)).not.toBeNull();
});