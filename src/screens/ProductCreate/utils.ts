import { Product } from '../../database/entities';
import * as Utils from '../../utils';

export const serializeProduct = (product?: Product): FormData => {
  const defaultValues = {
    name: '',
    brand: '',
    producer: '',
    portionQuantity: '',
    carbs: '',
    sugars: '',
    prots: '',
    fats: '',
    fattyAcids: '',
    kcal: '',
    barcode: '',
  };

  if (product) {
    const { macro, barcode, portion, name } = product;

    const parsedMacro = Object.fromEntries(
      Object.entries(macro).map(
        ([prop, value]) => [prop, String(value)]
      )
    );

    const parsedBarcode = Utils.isNil(barcode) ? '' : String(barcode);

    const formData: FormData = {
      ...defaultValues,
      ...parsedMacro,
      name,
      barcode: parsedBarcode,
      portionQuantity: String(portion),
    };

    return formData;
  }

  return defaultValues;
}

export const deserializeProduct = (productData: FormData) => {
  const { fattyAcids, sugars, ...restData } = productData;

  const macro = {
    carbs: Number(productData.carbs),
    prots: Number(productData.prots),
    fats: Number(productData.fats),
    kcal: Number(productData.kcal)
  }

  const barcode = productData.barcode.length ? productData.barcode : null;
  const portionQuantity = Number(productData.portionQuantity);

  const product = {
    ...restData,
    macro,
    barcode,
    portionQuantity,
  }

  return product;
}

export type FormData = {
  name: string
  brand: string
  producer: string
  portionQuantity: string
  carbs: string
  sugars: string
  prots: string
  fats: string
  fattyAcids: string
  kcal: string
  barcode: string
}