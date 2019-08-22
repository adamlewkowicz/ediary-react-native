import React from 'react';
import {
  render,
  fireEvent,
  findByText,
  wait,
} from '@testing-library/react-native';
import { App } from '../../../__tests__/utils';
import { Meal, Product, MealProduct } from '../../database/entities';

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

  const createMealNameInput = getByPlaceholderText('Nazwa nowego posiłku');
  fireEvent.changeText(createMealNameInput, mealName);

  const createMealConfirmButton = getByLabelText('Utwórz nowy posiłek');
  fireEvent.press(createMealConfirmButton);
  
  const toggleMealButton = await findByLabelText('Pokaż szczegóły posiłku');

  expect(toggleMealButton).toBeTruthy();
  await expect(findByText(mealName)).toBeTruthy();
});

test('navigates to product search screen and adds product to meal', async () => {
  const mealMock = await Meal.save({ name: 'Tomato soup' });
  const productMock = await Product.save({ name: 'Tomatoes' });
  const mealId = mealMock.id;
  const productId = productMock.id;

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
  await expect(MealProduct.findOne({ productId, mealId })).toBeTruthy();
});

// test('removes product from meal', async () => {});

test('updates product\'s quantity', async () => {
  const carbsMock = 10;
  const quantityMock = 180;
  const carbsAfterQuantityUpdate = 18;
  const productMock = await Product.save({ name: 'Milk', carbs: carbsMock });
  const productId = productMock.id;
  const mealMock = await Meal.createWithProduct({ name: 'Milk soup' }, productId);
  const mealId = mealMock.id;

  const { findByLabelText } = render(<App />);

  const toggleMealButton = await findByLabelText('Pokaż szczegóły posiłku');
  fireEvent.press(toggleMealButton);

  const toggleProductButton = await findByLabelText('Pokaż szczegóły produktu');
  fireEvent.press(toggleProductButton);
  
  const productQuantityInput = await findByLabelText('Zmień ilość produktu');
  fireEvent.changeText(productQuantityInput, quantityMock);
  
  await findByText(
    toggleProductButton,
    /180/
  );
  await findByText(
    toggleProductButton,
    carbsAfterQuantityUpdate.toString()
  );
  await wait(async () => {
    const mealProduct = await MealProduct.findOneOrFail({ mealId });
    expect(mealProduct.quantity).toEqual(quantityMock);
  });
});