import React from 'react';
import { render, fireEvent, findByText } from '@testing-library/react-native';
import { App } from '../../../__tests__/utils';
import { Meal, Product } from '../../database/entities';

test('creates new meal and displays it', async () => {
  const mealName = 'Cucumber soup';

  const {
    findByLabelText,
    getByPlaceholderText,
    getByLabelText,
    findByText,
  } = render(
    <App />
  );

  const createMealNameInput = getByPlaceholderText('Nazwa posiłku');
  fireEvent.changeText(createMealNameInput, mealName);

  const createMealConfirmButton = getByLabelText('Utwórz nowy posiłek');
  fireEvent.press(createMealConfirmButton);
  
  const toggleMealButton = await findByLabelText('Pokaż szczegóły posiłku');

  expect(toggleMealButton).toBeTruthy();
  await expect(findByText(mealName)).toBeTruthy();
});

test('navigates to product search page and adds product to meal', async () => {
  const mealMock = await Meal.save({ name: 'Tomato soup' });
  const productMock = await Product.save({ name: 'Tomatoes' });
  const mealAddProductSpy = jest.spyOn(Meal, 'addProduct');
  const defaultQuantity = 100;

  const {
    findByLabelText,
    findByPlaceholderText,
  } = render(
    <App />
  );

  const toggleMealButton = await findByLabelText('Pokaż szczegóły posiłku');
  fireEvent.press(toggleMealButton);

  const addMealProductNavButton = await findByLabelText('Wyszukaj produkt do posiłku');
  fireEvent.press(addMealProductNavButton);

  // check if page changed to ProductFinder

  const searcherInput = await findByPlaceholderText('Nazwa produktu');
  fireEvent.press(searcherInput);
  fireEvent.changeText(searcherInput, productMock.name);

  const foundProductButton = await findByLabelText('Dodaj produkt do posiłku');
  fireEvent.press(foundProductButton);

  // check if page changed to Home

  await expect(findByText(toggleMealButton, productMock.name)).toBeTruthy();
  expect(mealAddProductSpy).toHaveBeenCalledWith(
    mealMock.id,
    productMock.id,
    defaultQuantity,
    productMock.unit
  );
});