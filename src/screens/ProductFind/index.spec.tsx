import React from 'react';
import { fireEvent } from '@testing-library/react-native';
import { renderSetup } from '../../../__tests__/utils';
import { Product, Meal } from '../../database/entities';
import { ProductFindScreen } from '.';
import { ProductFindScreenNavigationProps } from '../../navigation';
import { APP_ROUTE } from '../../navigation/consts';

describe('<ProductFindScreen />', () => {

  describe('when searches for product 🔎', () => {

    it('should display found products', async () => {
      const productMock = await Product.save({ name: 'tomatoe' });
      const ctx = renderSetup(<ProductFindScreen />);
  
      const productFindInput = ctx.getByLabelText('Nazwa szukanego produktu');
      fireEvent.changeText(productFindInput, productMock.name);

      await ctx.findByText(productMock.name);
    });

    describe('when selects product', () => {

      it('should return choosen product as product resolver', async () => {
        const paramsMock = {
          onProductSelected: jest.fn()
        }
        const productMock = await Product.save({ name: 'tomatoe' });
        const ctx = renderSetup<ProductFindScreenNavigationProps>(
          <ProductFindScreen />, { params: paramsMock }
        );
    
        const productFindInput = ctx.getByLabelText('Nazwa szukanego produktu');
        fireEvent.changeText(productFindInput, productMock.name);

        const addProductToMealButton = await ctx.findByLabelText('Dodaj produkt do posiłku');
        fireEvent.press(addProductToMealButton);
  
        expect(paramsMock.onProductSelected).toHaveBeenCalledTimes(1);
        expect(paramsMock.onProductSelected).toHaveBeenCalledWith(
          expect.any(Function),
          productMock.portion
        );
      });

    });

  });

  it('should display recently used products', async () => {
    const productMock = await Product.save({ name: 'Fish' });
    await Meal.createWithProductId({ name: 'Fish soup' }, productMock.id);
  
    const ctx = renderSetup(<ProductFindScreen />);
  
    await ctx.findByText(productMock.name);
  });

  describe('when presses on barcode button', () => {

    it('should navigate to barcode scan screen 🧭', async () => {
      const ctx = renderSetup(<ProductFindScreen />);

      const barcodeScanNavButton = await ctx.findByLabelText('Zeskanuj kod kreskowy');
      fireEvent.press(barcodeScanNavButton);

      expect(ctx.mocks.navigationContext.navigate).toHaveBeenCalledTimes(1);
      expect(ctx.mocks.navigationContext.navigate).toHaveBeenCalledWith(
        APP_ROUTE.BarcodeScan,
        expect.any(Object)
      );
    });

  });

});