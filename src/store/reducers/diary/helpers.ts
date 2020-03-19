import { DAYJS_DATETIME_BASE } from '../../../common/consts';
import { Meal, MealProduct, IProductMerged } from '../../../database/entities';
import { getTimeFromDate, calculateMacroPerQuantity } from '../../../common/utils';
import {
  DiaryMealTemplate,
  MealTemplate,
  DiaryMeal,
  DiaryProduct,
  DiaryMealOrTemplate,
} from './types';
import dayjs from 'dayjs';

export const getDiaryMealTemplate = (
  template: MealTemplate
): DiaryMealTemplate => ({
  type: 'template',
  data: template,
  productIds: [],
  isOpened: false,
  dateTime: template.dateTime,
  dateTimeBase: template.dateTimeBase as any,
});

export const normalizeProductEntity = (mealProductEntity: MealProduct | IProductMerged): DiaryProduct => {
  const { meal, product, ...data } = mealProductEntity;

  const normalizedProduct: DiaryProduct = {
    ...data,
    data: product,
    calcedMacro: calculateMacroPerQuantity(product.macro, product.portion)
  }
  
  return normalizedProduct;
}

export const normalizeMealEntity = (
  mealEntity: Meal
) => {
  const { mealProducts = [], ...meal } = mealEntity;

  const normalizedMeal: DiaryMeal = {
    data: meal,
    type: 'meal',
    isOpened: false,
    dateTime: getTimeFromDate(meal.date),
    dateTimeBase: dayjs(meal.date).format(DAYJS_DATETIME_BASE),
    productIds: mealProducts.map(mealProduct => mealProduct.productId),
  }

  const normalizedProducts = mealProducts.map<DiaryProduct>(normalizeProductEntity);

  return {
    meal: normalizedMeal,
    products: normalizedProducts
  }
}

export const normalizeMealEntities = (
  payload: Meal[]
): NormalizeMealsResult => {
  return payload.reduce<NormalizeMealsResult>((normalized, mealEntity) => {
    const { meal, products } = normalizeMealEntity(mealEntity);
    
    return {
      meals: [...normalized.meals, meal],
      products: [...normalized.products, ...products]
    }
  }, { meals: [], products: [] });
}

export const isDiaryMeal = (meal: DiaryMealOrTemplate): meal is DiaryMeal => meal.type === 'meal';

type NormalizeMealsResult = {
  meals: DiaryMeal[]
  products: DiaryProduct[]
}