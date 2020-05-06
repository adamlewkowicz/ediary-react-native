import { Product, IProductRequired } from '../../database/entities';
import * as Utils from '../../utils';
import * as Yup from 'yup';
import { ProductUnitType } from '../../types';

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

export const deserializeProduct = (productData: FormData): {
  product: IProductRequired
  portionQuantity: number
} => {

  const macro = {
    carbs: Number(productData.carbs),
    prots: Number(productData.prots),
    fats: Number(productData.fats),
    kcal: Number(productData.kcal),
  }

  const barcode = productData.barcode.length ? productData.barcode : null;
  const portionQuantity = Number(productData.portionQuantity);

  const product: IProductRequired = {
    name: productData.name,
    macro,
    barcode,
  }

  return { product, portionQuantity };
}

const MAX_PORTION_QUANTITY = 2000;

const MIN_PRODUCT_NAME = 3;

export const getValidationSchema = (portionUnitType: ProductUnitType) => Yup.object({
  name: Yup.string()
    .min(MIN_PRODUCT_NAME, `Nazwa powinna zawierać min. ${MIN_PRODUCT_NAME} znaki`)
    .required('Nazwa jest wymagana'),
  brand: Yup.string(),
  producer: Yup.string(),
  portionQuantity: Yup
    .number()
    .max(
      MAX_PORTION_QUANTITY,
      `Maksymalna ilość w jednej porcji to ${MAX_PORTION_QUANTITY} ${portionUnitType}`
    ),
  carbs: Yup.number(),
  sugars: Yup.number(),
  prots: Yup.number(),
  fats: Yup.number(),
  fattyAcids: Yup.number(),
  kcal: Yup.number(),
  barcode: Yup.string(),
});

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