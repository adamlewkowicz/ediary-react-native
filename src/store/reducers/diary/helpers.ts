import { TemplateId, TemplateIdReverted } from '../../../types';
import { DAYJS_DATETIME_BASE } from '../../../common/consts';
import { Meal } from '../../../database/entities';
import { getDayFromDate, getTimeFromDate, calculateMacroPerQuantity } from '../../../common/utils';
import {
  DiaryMealTemplate,
  DiaryTemplate,
  NormalizeMealsResult,
  DiaryMeal,
  DiaryProduct,
} from './types';
import dayjs from 'dayjs';

export const getRevertedTemplateId = (
  templateId: TemplateId
): TemplateIdReverted => {
  return ((templateId as any) * -1) as any;
}

export const getMealFromTemplate = (
  template: DiaryTemplate
): DiaryMealTemplate => {
  return {
    id: getRevertedTemplateId(template.id),
    name: template.name,
    type: 'template',
    macro: {
      carbs: 0,
      prots: 0,
      fats: 0,
      kcal: 0,
    },
    day: null,
    date: null,
    time: template.time,
    isToggled: false,
    templateId: template.id,
    productIds: [],
    dateTimeBase: dayjs(template.time as any).format(DAYJS_DATETIME_BASE),
  }
}

export const normalizeMeal = (
  mealEntity: Meal
) => {
  const { mealProducts = [], ...meal } = mealEntity;

  const normalizedMeal: DiaryMeal = {
    ...meal,
    type: 'meal',
    isToggled: false,
    day: getDayFromDate(meal.date),
    time: getTimeFromDate(meal.date),
    dateTimeBase: dayjs(meal.date).format(DAYJS_DATETIME_BASE),
    productIds: mealProducts.map(mealProduct => mealProduct.productId),
  }

  const normalizedProducts = mealProducts.map<DiaryProduct>(mealProductEntity => {
    const { meal, product, ...data } = mealProductEntity;

    const normalizedProduct: DiaryProduct = {
      ...data,
      data: product,
      calcedMacro: calculateMacroPerQuantity(product.macro, product.portion)
    }
    
    return normalizedProduct;
  });

  return {
    meal: normalizedMeal,
    products: normalizedProducts
  }
}

export const normalizeMeals = (
  payload: Meal[]
): NormalizeMealsResult => {
  return payload.reduce<NormalizeMealsResult>((normalized, mealEntity) => {
    const { meal, products } = normalizeMeal(mealEntity);
    return {
      meals: [...normalized.meals, meal],
      products: [...normalized.products, ...products]
    }
  }, { meals: [], products: [] });
}