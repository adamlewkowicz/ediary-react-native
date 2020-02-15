import React from 'react';
import { fireEvent, render } from '@testing-library/react-native';
import { App } from '../../../__tests__/utils';
import { Product } from '../../database/entities';

describe('<ProductCreate />', () => {

  it('creating new product should work', async () => {
    const productMock = {
      name: 'Orange Juice',
      producer: 'Gardens',
      quantity: 140,
      barcode: '391287145',
      macro: {
        carbs: 249,
        prots: 25,
        fats: 12,
        kcal: 319,
      },
    }
    const productSaveSpy = jest.spyOn(Product, 'save');
    // need to render whole app with navigation top bar button
    const ctx = render(<App screen="ProductCreate" />);

    const nameInput = ctx.getByLabelText('Nazwa produktu');
    const producerInput = ctx.getByLabelText('Producent');
    const quantityInput = ctx.getByLabelText('Ilość produktu');
    const carbsInput = ctx.getByLabelText('Węglowodany');
    const protsInput = ctx.getByLabelText('Białka');
    const fatsInput = ctx.getByLabelText('Tłuszcze');
    const kcalInput = ctx.getByLabelText('Kalorie');
    const barcodeInput = ctx.getByLabelText('Kod kreskowy');
    const saveProductButton = ctx.getByLabelText('Zapisz produkt');
  
    fireEvent.changeText(nameInput, productMock.name);
    fireEvent.changeText(producerInput, productMock.producer);
    fireEvent.changeText(quantityInput, productMock.quantity.toString());
    fireEvent.changeText(carbsInput, productMock.macro.carbs.toString());
    fireEvent.changeText(protsInput, productMock.macro.prots.toString());
    fireEvent.changeText(fatsInput, productMock.macro.fats.toString());
    fireEvent.changeText(kcalInput, productMock.macro.kcal.toString());
    fireEvent.changeText(barcodeInput, productMock.barcode);
    fireEvent.press(saveProductButton);

    expect(productSaveSpy).toHaveBeenCalledTimes(1);
  });

});