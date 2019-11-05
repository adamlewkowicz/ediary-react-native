import React from 'react';
import { fireEvent } from '@testing-library/react-native';
import { renderSetup } from '../../../__tests__/utils';
import { Product } from '../../database/entities';
import { configureStore } from '../../store';
import { ProductFind } from '.';
import { ProductFindParams } from './params';

describe('<ProductFind />', () => {

  describe('when searches for product 🔎', () => {

    const act = async () => {
      const productMock = await Product.save({ name: 'tomatoe' });
      const ctx = renderSetup(<ProductFind />);
  
      const productFindInput = ctx.getByLabelText('Nazwa szukanego produktu');
      fireEvent.changeText(productFindInput, productMock.name);

      return { ...ctx, productFindInput, productMock };
    }

    it('should display found products', async () => {
      const ctx = await act();
      await ctx.findByText(ctx.productMock.name);
    });

    describe('when presses on found product', () => {

      it('should return choosen product', async () => {
        const params: ProductFindParams = {
          onItemPress: jest.fn()
        }
        const productMock = await Product.save({ name: 'tomatoe' });
        const ctx = renderSetup(<ProductFind />, { params });
    
        const productFindInput = ctx.getByLabelText('Nazwa szukanego produktu');
        fireEvent.changeText(productFindInput, productMock.name);

        const addProductToMealButton = await ctx.findByLabelText('Dodaj produkt do posiłku');
        fireEvent.press(addProductToMealButton);
  
        expect(params.onItemPress).toHaveBeenCalledTimes(1);
        expect(params.onItemPress).toHaveBeenCalledWith({ ...productMock, portions: [] });
      });

    });

    describe('when no products were found 🚫', () => {

      it('should display product create button', async () => {
        const ctx = renderSetup(<ProductFind />);
  
        const productFindInput = ctx.getByLabelText('Nazwa szukanego produktu');
        fireEvent.changeText(productFindInput, 'abc');
  
        const productCreateButton = await ctx.findByLabelText('Dodaj własny produkt');
        fireEvent.press(productCreateButton);
  
        expect(ctx.mocks.navigationContext.navigate).toHaveBeenCalledTimes(1);
        expect(ctx.mocks.navigationContext.navigate).toHaveBeenCalledWith(
          'ProductCreate', expect.any(Object)
        );
      });
  
    });

  });

  it('should display recently used products', async () => {
    const productMock = await Product.save({ name: 'Fish' });
    // store has to be mocked, since recent products are fetched on home screen and
    // after interactions has been finished
    const store = configureStore({
      productHistory: [productMock]
    });
  
    const ctx = renderSetup(<ProductFind />, { store });
  
    await ctx.findByText(productMock.name);
  });

  describe('when presses on barcode button', () => {

    it('should navigate to barcode scan screen 🧭', async () => {
      const ctx = renderSetup(<ProductFind />);

      const barcodeScanNavButton = await ctx.findByLabelText('Zeskanuj kod kreskowy');
      fireEvent.press(barcodeScanNavButton);

      expect(ctx.mocks.navigationContext.navigate).toHaveBeenCalledTimes(1);
      expect(ctx.mocks.navigationContext.navigate).toHaveBeenCalledWith(
        'BarcodeScan', expect.any(Object)
      );
    });

  });

});