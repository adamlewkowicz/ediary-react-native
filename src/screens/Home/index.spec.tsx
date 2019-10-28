import React from 'react';
import {
  render,
  fireEvent,
  wait,
  within,
} from '@testing-library/react-native';
import { App, renderSetup } from '../../../__tests__/utils';
import { Meal, Product, MealProduct } from '../../database/entities';
import { Home } from '.';

describe('<Home />', () => {

  it('should create new meal and display it', async () => {
    const mealName = 'Cucumber soup';
    const ctx = renderSetup(<Home />);

    const createMealNameInput = ctx.getByPlaceholderText('Nazwa nowego posiłku');
    fireEvent.changeText(createMealNameInput, mealName);
  
    const createMealConfirmButton = ctx.getByLabelText('Utwórz nowy posiłek');
    fireEvent.press(createMealConfirmButton);
    
    const toggleMealButton = await ctx.findByText(mealName);
  
    expect(toggleMealButton).toBeTruthy();
    expect(await Meal.findOneOrFail({ name: mealName })).toBeInstanceOf(Meal);
  });

  describe('when user adds new product to meal 🥗', () => {

    it('should navigate to product find screen 🧭', async () => {
      const ctx = renderSetup(<Home />);
    
      const [toggleMealButton] = await ctx.findAllByLabelText('Pokaż szczegóły posiłku');
      fireEvent.press(toggleMealButton);
    
      const addMealProductNavButton = await ctx.findByLabelText('Wyszukaj produkt do posiłku');
      fireEvent.press(addMealProductNavButton);

      expect(ctx.mocks.navigationContext.navigate).toHaveBeenCalledTimes(1);
      expect(ctx.mocks.navigationContext.navigate).toHaveBeenCalledWith('ProductFind', expect.any(Object));
    });

    it('should add selected product to meal', async () => {
      const productMock = await Product.save({ name: 'Tomatoes' });
      const ctx = renderSetup(<Home />);

      ctx.mocks.navigationContext.navigate
        .mockImplementationOnce((screenName, params) => params.onItemPress(productMock))
        .mockImplementationOnce(() => {});

      const [toggleMealButton] = await ctx.findAllByLabelText('Pokaż szczegóły posiłku');
      fireEvent.press(toggleMealButton);
    
      const addMealProductNavButton = await ctx.findByLabelText('Wyszukaj produkt do posiłku');
      fireEvent.press(addMealProductNavButton);

      const addedProduct = await ctx.findByText(productMock.name);

      expect(addedProduct).toBeTruthy();
      expect(ctx.mocks.navigationContext.navigate).toHaveBeenCalledTimes(2);
      expect(ctx.mocks.navigationContext.navigate).toHaveBeenNthCalledWith(2, 'Home', undefined);
      expect(await MealProduct.findOneOrFail({ productId: productMock.id })).toBeInstanceOf(MealProduct);
    });
    
  });

  it('should update product\'s quantity', async () => {
    const quantityMock = 180;
    const productMock = await Product.save({ name: 'Milk', macro: { kcal: 100 }});
    const mealMock = await Meal.createWithProduct({ name: 'Milk soup' }, productMock.id);
    const ctx = renderSetup(<Home />);

    const toggleMealButton = await ctx.findByText(mealMock.name);
    fireEvent.press(toggleMealButton);
  
    const toggleProductButton = await ctx.findByLabelText('Pokaż szczegóły produktu');
    fireEvent.press(toggleProductButton);
  
    const productQuantityInput = await ctx.findByLabelText('Zmień ilość produktu');
    fireEvent.changeText(productQuantityInput, quantityMock);

    const [productMacroData] = await ctx.findAllByLabelText('Makroskładniki produktu');

    const productQuantityText = await ctx.findByLabelText('Ilość produktu');
    const productCaloriesText = await ctx.findByLabelText('Kalorie w produkcie');

    expect(productQuantityText).toHaveTextContent(`${quantityMock}g`);
    await wait(async () => {
      const productCaloriesText = await ctx.findByLabelText('Kalorie w produkcie');
      expect(productCaloriesText).not.toHaveTextContent('0 kcal');
    });
  });

});

test('changing date display accurate meals', async () => {
  const mealMock = await Meal.save({ name: 'Salad' });
  const {
    findByLabelText,
    queryByText,
    findByText,
  } = render(<App />);

  await findByText(mealMock.name);
  
  const nextDayButton = await findByLabelText('Następny dzień');
  fireEvent.press(nextDayButton);

  await wait(() => expect(queryByText(mealMock.name)).toBeFalsy());

  const prevDayButton = await findByLabelText('Poprzedni dzień');
  fireEvent.press(prevDayButton);

  await findByText(mealMock.name)
});

test('creates new meal and displays it', async () => {
  const mealName = 'Cucumber soup';

  const {
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
  
  const toggleMealButton = await findByText(mealName);

  expect(toggleMealButton).toBeTruthy();
  expect(await Meal.findOneOrFail({ name: mealName })).toBeTruthy();
});

test('creates meal using correct date', async () => {
  const mealName = 'Fruit salad';
  const {
    findByLabelText,
    queryByText,
    findByText,
    getByPlaceholderText,
    getByLabelText,
  } = render(<App />);

  const nextDayButton = await findByLabelText('Następny dzień');
  fireEvent.press(nextDayButton);

  const createMealNameInput = getByPlaceholderText('Nazwa nowego posiłku');
  fireEvent.changeText(createMealNameInput, mealName);

  const createMealConfirmButton = getByLabelText('Utwórz nowy posiłek');
  fireEvent.press(createMealConfirmButton);

  await findByText(mealName);

  const prevDayButton = await findByLabelText('Poprzedni dzień');
  fireEvent.press(prevDayButton);

  await wait(() => expect(queryByText(mealName)).toBeFalsy());
});

test('navigates to product search screen and adds product to meal', async () => {
  const productMock = await Product.save({ name: 'Tomatoes' });
  const productId = productMock.id;
  const mealId = 1;

  const {
    findByLabelText,
    findByPlaceholderText,
    findAllByLabelText,
    findByText,
  } = render(
    <App />
  );

  const [toggleMealButton] = await findAllByLabelText('Pokaż szczegóły posiłku');
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

  await wait(async () => {
    const mealProduct = await MealProduct.findOne({ mealId, productId });
    expect(mealProduct).toBeTruthy();
  });
  expect(await findByText(productMock.name)).toBeTruthy();
});

// test('removes product from meal', async () => {});

test('updates product\'s quantity', async () => {
  const carbsMock = 10;
  const quantityMock = 180;
  const carbsAfterQuantityUpdate = 18;
  const productMock = await Product.save({ name: 'Milk', macro: { carbs: carbsMock }});
  const productId = productMock.id;
  const mealMock = await Meal.createWithProduct({ name: 'Milk soup' }, productId);
  const mealId = mealMock.id;
  const baseQuantity = 100;

  const {
    findByLabelText,
    findByText,
    findAllByLabelText,
  } = render(<App />);

  const toggleMealButton = await findByText(mealMock.name);
  fireEvent.press(toggleMealButton);

  const toggleProductButton = await findByLabelText('Pokaż szczegóły produktu');
  fireEvent.press(toggleProductButton);

  const productQuantityText = await findByLabelText('Ilość produktu');
  expect(productQuantityText).toHaveTextContent(`${baseQuantity}g`);

  const productQuantityInput = await findByLabelText('Zmień ilość produktu');
  fireEvent.changeText(productQuantityInput, quantityMock);

  const [productMacroData] = await findAllByLabelText('Makroskładniki produktu');

  expect(productQuantityText).toHaveTextContent(`${quantityMock}g`); // /180\s+g/
  await within(productMacroData).findByText(carbsAfterQuantityUpdate.toString());
  await wait(async () => {
    const mealProduct = await MealProduct.findOneOrFail({
      mealId,
      productId
    });
    expect(mealProduct.quantity).toEqual(quantityMock);
  });
});