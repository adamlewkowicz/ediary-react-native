import React from 'react';
import {
  fireEvent,
  wait,
  within,
} from '@testing-library/react-native';
import { renderSetup } from '../../../__tests__/utils';
import { Meal, Product, MealProduct } from '../../database/entities';
import { Home } from '.';
import { Alert } from 'react-native';

describe('<Home />', () => {

  const mockMealWithProduct = async () => {
    const productMock = await Product.save({ name: 'Milk', macro: { kcal: 100 }});
    const mealMock = await Meal.createWithProductId({ name: 'Milk soup' }, productMock.id);
    return { productMock, mealMock };
  }

  it('should create new meal and display it', async () => {
    const mealName = 'Cucumber soup';
    const ctx = renderSetup(<Home />);

    const createMealNameInput = ctx.getByPlaceholderText('Kurczak z warzywami');
    fireEvent.changeText(createMealNameInput, mealName);
  
    const createMealConfirmButton = ctx.getByLabelText('Utwórz nowy posiłek');
    fireEvent.press(createMealConfirmButton);
    
    const toggleMealButton = await ctx.findByText(mealName);
  
    expect(toggleMealButton).toBeTruthy();
    expect(await Meal.findOneOrFail({ name: mealName })).toBeInstanceOf(Meal);
  });

  describe('when adds new product to meal 🥗', () => {

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
      const productResolverMock = async () => productMock;
      const navigationItemPressMock = (_: any, params: any) => params.onItemPress(productResolverMock);
      const ctx = renderSetup(<Home />);

      ctx.mocks.navigationContext.navigate
        .mockImplementationOnce(navigationItemPressMock)
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

  describe('when changes product\'s quantity', () => {

    const arrange = async () => {
      const quantityMock = 180;
      const productMock = await Product.save({ name: 'Milk', macro: { kcal: 100 }});
      const mealMock = await Meal.createWithProductId({ name: 'Milk soup' }, productMock.id);
      const ctx = renderSetup(<Home />);
  
      const toggleMealButton = await ctx.findByText(mealMock.name);
      fireEvent.press(toggleMealButton);
    
      const toggleProductButton = await ctx.findByLabelText('Pokaż szczegóły lub usuń produkt');
      fireEvent.press(toggleProductButton);
    
      const productQuantityInput = await ctx.findByLabelText('Zmień ilość produktu');
      fireEvent.changeText(productQuantityInput, quantityMock);

      return {
        ...ctx,
        toggleProductButton,
        mocks: {
          ...ctx.mocks,
          quantity: quantityMock,
          product: productMock,
          meal: mealMock,
        }
      }
    }

    it('should update displayed quantity 🧮', async () => {
      const ctx = await arrange();
      
      const productQuantityText = await within(ctx.toggleProductButton).findByLabelText('Ilość produktu');

      expect(productQuantityText).toHaveTextContent(ctx.mocks.quantity + 'g');
    });

    it('should update quantity in database 🗄️', async () => {
      const mealProductUpdateSpy = jest.spyOn(MealProduct, 'update');
      const ctx = await arrange();
      const productId = ctx.mocks.product.id;
      const mealId = ctx.mocks.meal.id;
      const quantity = ctx.mocks.quantity;

      await wait(() => expect(mealProductUpdateSpy).toHaveBeenCalledTimes(1));
      expect(mealProductUpdateSpy).toHaveBeenCalledWith({ productId, mealId  },{ quantity });
    });

  });

  it('removing meal should work 🗑️', async () => {
    const productMock = await Product.save({ name: 'Milk', macro: { kcal: 100 }});
    const mealMock = await Meal.createWithProductId({ name: 'Milk soup' }, productMock.id);
    const mealDeleteSpy = jest.spyOn(Meal, 'delete');
    const alertSpy = jest.spyOn(Alert, 'alert')
      .mockImplementationOnce((title, msg, [onCancel, onSuccess]: any) => onSuccess.onPress());
    const ctx = renderSetup(<Home />);

    const removeMealButton = await ctx.findByText(mealMock.name);
    fireEvent.longPress(removeMealButton);

    expect(alertSpy).toHaveBeenCalledTimes(1);
    expect(mealDeleteSpy).toHaveBeenCalledTimes(1);
    await wait(() => expect(ctx.queryByText(mealMock.name)).toBeNull());
  });

  it('removing product from meal should work 🗑️', async () => {
    const { productMock, mealMock } = await mockMealWithProduct(); 
    const ctx = renderSetup(<Home />);
    const mealProductDeleteSpy = jest.spyOn(MealProduct, 'delete');
    const alertSpy = jest.spyOn(Alert, 'alert')
      .mockImplementationOnce((title, msg, [onCancel, onSuccess]: any) => onSuccess.onPress());

    const toggleMealButton = await ctx.findByText(mealMock.name);
    fireEvent.press(toggleMealButton);

    const productDeleteButton = await ctx.findByLabelText('Pokaż szczegóły lub usuń produkt');
    fireEvent.longPress(productDeleteButton);

    expect(alertSpy).toHaveBeenCalledTimes(1);
    expect(mealProductDeleteSpy).toHaveBeenCalledTimes(1);
    await wait(() => expect(ctx.queryByText(productMock.name)).toBeNull());
  });

  describe('when changes date 📅', () => {

    it('should display accurate meals', async () => {
      const { mealMock } = await mockMealWithProduct();
      const ctx = renderSetup(<Home />);

      const nextDayButton = await ctx.findByLabelText('Następny dzień');
      fireEvent.press(nextDayButton);

      await wait(() => expect(ctx.queryByText(mealMock.name)).toBeFalsy());

      const prevDayButton = await ctx.findByLabelText('Poprzedni dzień');
      fireEvent.press(prevDayButton);

      await wait(() => expect(ctx.queryByText(mealMock.name)).toBeTruthy());
    });

  });

});