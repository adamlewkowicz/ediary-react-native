import React from 'react';
import {
  fireEvent,
  wait,
} from '@testing-library/react-native';
import { renderSetup } from '../../../__tests__/utils';
import { Meal, Product, MealProduct } from '../../database/entities';
import { NutritionHomeScreen } from '.';
import { Alert } from 'react-native';
import { APP_ROUTE } from '../../navigation/consts';

describe('<NutritionHomeScreen />', () => {

  const mockMealWithProduct = async () => {
    const productMock = await Product.save({ name: 'Milk', macro: { kcal: 100 }});
    const mealMock = await Meal.createWithProductId({ name: 'Milk soup' }, productMock.id);
    return { productMock, mealMock };
  }

  describe('when adds new product to meal 🥗', () => {

    it('should navigate to product find screen 🧭', async () => {
      const ctx = renderSetup(<NutritionHomeScreen />);

      const [firstMealTemplateOpenButton] = await ctx.findAllByLabelText('Pokaż szczegóły posiłku');
      fireEvent.press(firstMealTemplateOpenButton);

      const addProductToMealButton = await ctx.findByLabelText('Dodaj produkt do posiłku');
      fireEvent.press(addProductToMealButton);

      expect(ctx.mocks.navigationContext.navigate).toHaveBeenCalledTimes(1);
      expect(ctx.mocks.navigationContext.navigate).toHaveBeenCalledWith(
        APP_ROUTE.ProductFind,
        expect.any(Object)
      );
    });

    it('should add selected product to meal', async () => {
      const productMock = await Product.save({ name: 'Tomatoes' });
      const productResolverMock = async () => productMock;
      const navigationProductSelectedMock = (_: any, params: any) => params.onProductSelected(productResolverMock);
      const ctx = renderSetup(<NutritionHomeScreen />);

      ctx.mocks.navigationContext.navigate
        .mockImplementationOnce(navigationProductSelectedMock)
        .mockImplementationOnce(() => {});

      const [firstMealTemplateOpenButton] = await ctx.findAllByLabelText('Pokaż szczegóły posiłku');
      fireEvent.press(firstMealTemplateOpenButton);

      const addProductToMealButton = await ctx.findByLabelText('Dodaj produkt do posiłku');
      fireEvent.press(addProductToMealButton);

      const addedProduct = await ctx.findByText(productMock.name);

      expect(addedProduct).toBeTruthy();
      expect(ctx.mocks.navigationContext.navigate).toHaveBeenCalledTimes(2);
      expect(ctx.mocks.navigationContext.navigate).toHaveBeenNthCalledWith(1, 'ProductFind', expect.any(Object));
      expect(ctx.mocks.navigationContext.navigate).toHaveBeenNthCalledWith(2, 'NutritionHome');
      expect(await MealProduct.findOneOrFail({ productId: productMock.id })).toBeInstanceOf(MealProduct);
    });

  });

  describe('when changes product\'s quantity', () => {

    const arrangeProductQuantityUpdate = async () => {
      const { productMock, mealMock } = await mockMealWithProduct();
      const quantityMock = 180;

      const navigationProductQuantityUpdateMock = (_: any, params: any) => params.onProductQuantityUpdated(quantityMock);

      const ctx = renderSetup(<NutritionHomeScreen />);

      ctx.mocks.navigationContext.navigate
        .mockImplementationOnce(navigationProductQuantityUpdateMock);

      const toggleMealButton = await ctx.findByText(mealMock.name);
      fireEvent.press(toggleMealButton);

      const productItem = await ctx.findByText(productMock.name);
      fireEvent.press(productItem);

      return {
        ...ctx,
        mocks: {
          ...ctx.mocks,
          quantity: quantityMock,
          product: productMock,
          meal: mealMock,
        }
      }
    }

    it('should navigate to product preview screen 🧭', async () => {
      const ctx = await arrangeProductQuantityUpdate();

      expect(ctx.mocks.navigationContext.navigate).toHaveBeenCalledTimes(2);
      expect(ctx.mocks.navigationContext.navigate).toHaveBeenNthCalledWith(1,
        APP_ROUTE.ProductPreview,
        expect.any(Object)
      );
    });

    it('should update displayed quantity 🧮', async () => {
      const ctx = await arrangeProductQuantityUpdate();

      const productQuantityText = await ctx.findByLabelText('Ilość produktu');

      expect(productQuantityText).toHaveTextContent(ctx.mocks.quantity + 'g');
    });

    it('should update quantity in database 🗄️', async () => {
      const { mocks: { product, meal, quantity }} = await arrangeProductQuantityUpdate();
      const productId = product.id;
      const mealId = meal.id;

      // updating MealProduct and Meal entity is debounced
      await wait(async () => {
        const updatedMealProduct = await MealProduct.findOneOrFail({ mealId, productId, quantity });
        expect(updatedMealProduct).toBeInstanceOf(MealProduct);
      });
    });

  });

  it('removing meal should work 🗑️', async () => {
    const { mealMock } = await mockMealWithProduct();
    const mealDeleteSpy = jest.spyOn(Meal, 'delete');
    const alertConfirmSpy = jest.spyOn(Alert, 'alert')
      .mockImplementationOnce((title, msg, [onCancel, onConfirm]: any) => onConfirm.onPress());
    const ctx = renderSetup(<NutritionHomeScreen />);

    const removeMealButton = await ctx.findByText(mealMock.name);
    fireEvent.longPress(removeMealButton);

    expect(alertConfirmSpy).toHaveBeenCalledTimes(1);
    expect(mealDeleteSpy).toHaveBeenCalledTimes(1);
    await wait(() => expect(ctx.queryByText(mealMock.name)).toBeNull());
  });

  it('removing product from meal should work 🗑️', async () => {
    const { productMock, mealMock } = await mockMealWithProduct();
    const ctx = renderSetup(<NutritionHomeScreen />);
    const mealProductDeleteSpy = jest.spyOn(MealProduct, 'delete');
    const alertConfirmSpy = jest.spyOn(Alert, 'alert')
      .mockImplementationOnce((title, msg, [onCancel, onConfirm]: any) => onConfirm.onPress());

    const toggleMealButton = await ctx.findByText(mealMock.name);
    fireEvent.press(toggleMealButton);

    const productDeleteButton = await ctx.findByLabelText('Pokaż szczegóły lub usuń produkt');
    fireEvent.longPress(productDeleteButton);

    expect(alertConfirmSpy).toHaveBeenCalledTimes(1);
    expect(mealProductDeleteSpy).toHaveBeenCalledTimes(1);
    await wait(() => expect(ctx.queryByText(productMock.name)).toBeNull());
  });

  describe('when changes date 📅', () => {

    it('should display accurate meals', async () => {
      const { mealMock } = await mockMealWithProduct();
      const ctx = renderSetup(<NutritionHomeScreen />);

      const nextDayButton = await ctx.findByLabelText('Następny dzień');
      fireEvent.press(nextDayButton);

      await wait(() => expect(ctx.queryByText(mealMock.name)).toBeFalsy());

      const prevDayButton = await ctx.findByLabelText('Poprzedni dzień');
      fireEvent.press(prevDayButton);

      await wait(() => expect(ctx.queryByText(mealMock.name)).toBeTruthy());
    });

  });

});