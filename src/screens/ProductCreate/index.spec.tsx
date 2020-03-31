import React from 'react';
import { fireEvent, waitForElement } from 'react-native-testing-library';
import { Product } from '../../database/entities';
import { ProductCreateScreen } from '.';
import { renderSetup } from '../../../__tests__/utils';
import { APP_ROUTE } from '../../navigation/consts';
import { wait } from '@testing-library/react-native';

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

    const nameInput = ctx.getByA11yLabel('Nazwa');
    const producerInput = ctx.getByA11yLabel('Producent');
    const brandInput = ctx.getByA11yLabel('Marka');
    const portionQuantityInput = ctx.getByA11yLabel('Ilość g w jednej porcji');
    const carbsInput = ctx.getByA11yLabel('Węglowodany');
    const sugarsInput = ctx.getByA11yLabel('w tym cukry');
    const protsInput = ctx.getByA11yLabel('Białko');
    const fatsInput = ctx.getByA11yLabel('Tłuszcze');
    const fattyAcidsInput = ctx.getByA11yLabel('w tym kwasy tłuszczowe');
    const kcalInput = ctx.getByA11yLabel('Kalorie');
    const barcodeInput = ctx.getByA11yLabel('Kod kreskowy');
    const saveProductButton = ctx.getByA11yLabel('Zapisz produkt');
  
    fireEvent.changeText(nameInput, productMock.name);
    fireEvent.changeText(brandInput, productMock.brand);
    fireEvent.changeText(producerInput, productMock.producer);
    fireEvent.changeText(portionQuantityInput, productMock.quantity.toString());
    fireEvent.changeText(carbsInput, productMock.macro.carbs.toString());
    fireEvent.changeText(sugarsInput, productMock.macro.sugars.toString());
    fireEvent.changeText(protsInput, productMock.macro.prots.toString());
    fireEvent.changeText(fatsInput, productMock.macro.fats.toString());
    fireEvent.changeText(fattyAcidsInput, productMock.macro.fattyAcids.toString());
    fireEvent.changeText(kcalInput, productMock.macro.kcal.toString());
    fireEvent.changeText(barcodeInput, productMock.barcode);
    fireEvent.press(saveProductButton);

    await wait(() => {
      expect(productSaveSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('when presses calories calculate button', () => {

    it('should calculate calories based on provided macro nutriements 🧮', () => {
      const ctx = renderSetup(<ProductCreateScreen />);

      const kcalInput = ctx.getByA11yLabel('Kalorie');
      fireEvent.changeText(kcalInput, '0');

      const carbsInput = ctx.getByA11yLabel('Węglowodany');
      fireEvent.changeText(carbsInput, '100');

      const calculateCaloriesButton = ctx.getByA11yLabel('Oblicz');
      fireEvent.press(calculateCaloriesButton);

      expect(kcalInput.props.value).not.toEqual('0');
    });
    
  });

  describe('when presses barcode scan button', () => {

    it('should navigate to barcode scan screen 🧭', () => {
      const ctx = renderSetup(<ProductCreateScreen />); 

      const barcodeScanButton = ctx.getByA11yLabel('Zeskanuj');
      fireEvent.press(barcodeScanButton);

      expect(ctx.mocks.navigationContext.navigate).toHaveBeenCalledTimes(1);
      expect(ctx.mocks.navigationContext.navigate).toHaveBeenCalledWith(
        APP_ROUTE.BarcodeScan,
        expect.any(Object)
      );
    });

  });

});