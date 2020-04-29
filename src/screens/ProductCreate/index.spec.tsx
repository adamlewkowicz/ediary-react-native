import React from 'react';
import { fireEvent, wait, waitForElementToBeRemoved } from '@testing-library/react-native';
import { Product } from '../../database/entities';
import { ProductCreateScreen } from '.';
import { renderSetup } from '../../../test-utils';
import { APP_ROUTE } from '../../navigation/consts';

describe('<ProductCreateScreen />', () => {

  it('creating new product should work 🥝', async () => {
    const productMock = {
      name: 'Orange Juice',
      brand: 'Bart',
      producer: 'Gardens',
      quantity: 140,
      barcode: '391287145',
      macro: {
        carbs: 249,
        sugars: 41,
        prots: 25,
        fats: 12,
        kcal: 319,
        fattyAcids: 12,
      },
    }
    const productSaveSpy = jest.spyOn(Product, 'save');
    const ctx = renderSetup(<ProductCreateScreen />);

    const nameInput = ctx.getByLabelText('Nazwa');
    const producerInput = ctx.getByLabelText('Producent');
    const brandInput = ctx.getByLabelText('Marka');
    const portionQuantityInput = ctx.getByLabelText('Ilość g w jednej porcji');
    const carbsInput = ctx.getByLabelText('Węglowodany');
    const sugarsInput = ctx.getByLabelText('w tym cukry');
    const protsInput = ctx.getByLabelText('Białko');
    const fatsInput = ctx.getByLabelText('Tłuszcze');
    const fattyAcidsInput = ctx.getByLabelText('w tym kwasy tłuszczowe');
    const kcalInput = ctx.getByLabelText('Kalorie');
    const barcodeInput = ctx.getByLabelText('Kod kreskowy');
    const saveProductButton = ctx.getByLabelText('Zapisz produkt');
  
    fireEvent.changeText(nameInput, productMock.name);
    fireEvent.changeText(brandInput, productMock.brand);
    fireEvent.changeText(producerInput, productMock.producer);
    fireEvent.changeText(portionQuantityInput, String(productMock.quantity));
    fireEvent.changeText(carbsInput, String(productMock.macro.carbs));
    fireEvent.changeText(sugarsInput, String(productMock.macro.sugars));
    fireEvent.changeText(protsInput, String(productMock.macro.prots));
    fireEvent.changeText(fatsInput, String(productMock.macro.fats));
    fireEvent.changeText(fattyAcidsInput, String(productMock.macro.fattyAcids));
    fireEvent.changeText(kcalInput, String(productMock.macro.kcal));
    fireEvent.changeText(barcodeInput, String(productMock.barcode));
    fireEvent.press(saveProductButton);

    await ctx.findByLabelText('Trwa ładowanie');
    await waitForElementToBeRemoved(() => ctx.getByLabelText('Trwa ładowanie'));

    const productPayload = productSaveSpy.mock.calls[0][0];

    expect(productSaveSpy).toHaveBeenCalledTimes(1);
    expect(productPayload).toMatchSnapshot();
    expect(saveProductButton).not.toBeDisabled();
  });

  describe('when presses calories calculate button', () => {

    it('should calculate calories based on provided macro nutriements 🧮', async () => {
      const kcalMock = '0';
      const ctx = renderSetup(<ProductCreateScreen />);

      const kcalInput = ctx.getByLabelText('Kalorie');
      fireEvent.changeText(kcalInput, kcalMock);

      const carbsInput = ctx.getByLabelText('Węglowodany');
      fireEvent.changeText(carbsInput, '100');

      const calculateCaloriesButton = ctx.getByLabelText('Oblicz kalorie');
      fireEvent.press(calculateCaloriesButton);

      await wait(() => 
        expect(kcalInput.getProp('value')).not.toEqual(kcalMock)
      );
    });
    
  });

  describe('when presses barcode scan button', () => {

    it('should navigate to barcode scan screen 🧭', () => {
      const ctx = renderSetup(<ProductCreateScreen />); 

      const barcodeScanButton = ctx.getByLabelText('Zeskanuj');
      fireEvent.press(barcodeScanButton);

      expect(ctx.mocks.navigationContext.navigate).toHaveBeenCalledTimes(1);
      expect(ctx.mocks.navigationContext.navigate).toHaveBeenCalledWith(
        APP_ROUTE.BarcodeScan,
        expect.any(Object)
      );
    });

  });

});