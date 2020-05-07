import React from 'react';
import { fireEvent, wait, RenderResult } from '@testing-library/react-native';
import { renderSetup } from '../../../test-utils';
import { Product } from '../../database/entities';
import { ProductFindScreen } from '.';
import { ProductFindScreenNavigationProps } from '../../navigation';
import { APP_ROUTE } from '../../navigation/consts';

describe('<ProductFindScreen />', () => {

  const waitForRecentProductsLoaded = async (ctx: RenderResult) => {
    const recentProductsList = ctx.getByLabelText('Lista ostatnio używanych produktów');
    await wait(
      () => expect(recentProductsList).not.toBeBusy()
    );

    return { recentProductsList };
  }

  describe('when searches for product 🔎', () => {

    describe('when focuses on input', () => {

      it('should change active tab to products search tab 🔖', async () => {
        const ctx = renderSetup(<ProductFindScreen />);
        await waitForRecentProductsLoaded(ctx);
  
        const productFindInput = ctx.getByLabelText('Nazwa szukanego produktu');
        fireEvent.focus(productFindInput);

        await ctx.findByLabelText('Lista znalezionych produktów');
        const productSearchTabButton = ctx.getByLabelText('Znalezione');

        expect(productSearchTabButton).toBeSelected();
      });

    });

    it('should display found products list', async () => {
      const productMock = await Product.save({ name: 'tomatoe' });
      const ctx = renderSetup(<ProductFindScreen />);
      await waitForRecentProductsLoaded(ctx);
  
      const productFindInput = ctx.getByLabelText('Nazwa szukanego produktu');
      fireEvent.focus(productFindInput);
      fireEvent.changeText(productFindInput, productMock.name);

      await ctx.findByText(productMock.name);
    });

    describe('when selects product', () => {

      it('should return choosen product as a product resolver', async () => {
        const paramsMock = { onProductSelected: jest.fn() };
        const productMock = await Product.save({ name: 'tomatoe' });

        const ctx = renderSetup<ProductFindScreenNavigationProps>(
          <ProductFindScreen />, { params: paramsMock }
        );
        await waitForRecentProductsLoaded(ctx);
    
        const productFindInput = ctx.getByLabelText('Nazwa szukanego produktu');
        fireEvent.focus(productFindInput);
        fireEvent.changeText(productFindInput, productMock.name);

        const addProductToMealButton = await ctx.findByText(productMock.name);
        fireEvent.press(addProductToMealButton);
  
        expect(paramsMock.onProductSelected).toHaveBeenCalledTimes(1);
        expect(paramsMock.onProductSelected).toHaveBeenCalledWith(
          expect.any(Function),
          productMock.portion
        );
      });

    });

  });

  describe('when is on favorite products tab 🔖', () => {

    it('should display favorite products list 💖', async () => {
      const ctx = renderSetup(<ProductFindScreen />);
      await waitForRecentProductsLoaded(ctx);

      const productFavoritesTabButton = ctx.getByLabelText('Ulubione');
      fireEvent.press(productFavoritesTabButton);

      await ctx.findByLabelText('Lista ulubionych produktów');

      expect(productFavoritesTabButton).toBeSelected();
    });

  });

  describe('when is on recently used products tab 🔖', () => {
    
    it('should display recently used products list', async () => {
      const ctx = renderSetup(<ProductFindScreen />);
      await waitForRecentProductsLoaded(ctx);

      const recentProductsTabButton = ctx.getByLabelText('Ostatnio używane');

      expect(recentProductsTabButton).toBeSelected();
    });

  });

  describe('when presses on barcode button', () => {

    it('should navigate to barcode scan screen 🧭', async () => {
      const ctx = renderSetup(<ProductFindScreen />);
      await waitForRecentProductsLoaded(ctx);

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