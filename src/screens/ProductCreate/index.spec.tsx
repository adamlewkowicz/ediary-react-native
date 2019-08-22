import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { App } from '../../../__tests__/utils';
import { Product } from '../../database/entities';

test('creates new product', async () => {
  const productMock = {
    name: 'Orange Juice',
    producer: 'Gardens',
    quantity: '140',
    carbs: '249',
    prots: 25,
    fats: 12,
    kcal: 319,
    barcode: '391287145'
  }
  const productSaveSpy = jest.spyOn(Product, 'save');
  const {
    getByLabelText
  } = render(<App screen="ProductCreate" />);

  const nameInput = getByLabelText('Nazwa produktu');
  const producerInput = getByLabelText('Producent');
  const quantityInput = getByLabelText('Ilość produktu');
  const carbsInput = getByLabelText('Węglowodany');
  const protsInput = getByLabelText('Białka');
  const fatsInput = getByLabelText('Tłuszcze');
  const kcalInput = getByLabelText('Kalorie');
  const barcodeInput = getByLabelText('Kod kreskowy');
  const saveProductButton = getByLabelText('Zapisz produkt');

  fireEvent.changeText(nameInput, productMock.name);
  fireEvent.changeText(producerInput, productMock.name);
  fireEvent.changeText(quantityInput, productMock.name);
  fireEvent.changeText(carbsInput, productMock.name);
  fireEvent.changeText(protsInput, productMock.name);
  fireEvent.changeText(fatsInput, productMock.name);
  fireEvent.changeText(kcalInput, productMock.name);
  fireEvent.changeText(barcodeInput, productMock.name);
  fireEvent.press(saveProductButton);

  expect(productSaveSpy).toHaveBeenCalledTimes(1);
  expect(productSaveSpy).toHaveBeenCalledWith(productMock);
});