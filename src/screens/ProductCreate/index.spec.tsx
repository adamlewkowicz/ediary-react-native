import React from 'react';
import { fireEvent } from '@testing-library/react-native';
import { Product } from '../../database/entities';
import { ProductCreateScreen } from '.';
import { renderSetup } from '../../../__tests__/utils';

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
    const portionQuantityInput = ctx.getByLabelText('Ilość w jednej porcji');
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
    fireEvent.changeText(portionQuantityInput, productMock.quantity.toString());
    fireEvent.changeText(carbsInput, productMock.macro.carbs.toString());
    fireEvent.changeText(sugarsInput, productMock.macro.sugars.toString());
    fireEvent.changeText(protsInput, productMock.macro.prots.toString());
    fireEvent.changeText(fatsInput, productMock.macro.fats.toString());
    fireEvent.changeText(fattyAcidsInput, productMock.macro.fattyAcids.toString());
    fireEvent.changeText(kcalInput, productMock.macro.kcal.toString());
    fireEvent.changeText(barcodeInput, productMock.barcode);
    fireEvent.press(saveProductButton);

    expect(productSaveSpy).toHaveBeenCalledTimes(1);
  });

});