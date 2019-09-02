import { MacroElements, TemplateId, TemplateIdReverted } from '../../types';
import { MACRO_ELEMENTS } from '../../common/consts';
import { Meal } from '../../database/entities';
import { getDayFromDate, getTimeFromDate } from '../../common/utils';
import { DiaryMealType } from '../reducers/types/diary';

interface CalcMacroByQuantityData extends MacroElements {}
export const calcMacroByQuantity = <T extends CalcMacroByQuantityData>(
  macroData: T,
  quantity: number
) => MACRO_ELEMENTS.map(element => ({
  value: Math.round(macroData[element] * quantity / 100),
  element
}));

export const normalizeMeals = <T extends Meal[]>(
  payload: T,
  templateId: TemplateId | null = null,
) => {
  const meals = payload.map(meal => {
    const { mealProducts = [], ...data } = meal;
    return {
      ...data,
      isToggled: templateId != null,
      isTemplate: false,
      day: getDayFromDate(meal.date),
      time: getTimeFromDate(meal.date),
      productIds: mealProducts.map(mealProduct => mealProduct.productId),
      templateId,
    }
  });
  const products = payload.flatMap(({ mealProducts = [] }) => {
    return mealProducts.map(mealProduct => {
      const { meal, product, ...data } = mealProduct;
      const normalizedProduct = {
        ...data,
        ...product,
      }
      return {
        ...normalizedProduct,
        isToggled: false,
        calcedMacro: calcMacroByQuantity(normalizedProduct.macro, normalizedProduct.quantity)
      }
    })
  });
  return { meals, products };
}

export const normalizeMeal = (
  meal: Meal,
  templateId: TemplateId | null = null,
) => {
  const { mealProducts = [], ...data } = meal;
  const type: DiaryMealType = 'meal';
  const normalizedMeal = {
    ...data,
    isToggled: false,
    isTemplate: templateId != null,
    day: getDayFromDate(meal.date),
    time: getTimeFromDate(meal.date),
    productIds: mealProducts.map(mealProduct => mealProduct.productId),
    templateId,
    type,
  }
  const normalizedProducts = mealProducts.map(mealProduct => {
    const { meal, product, ...data } = mealProduct;
    const normalizedProduct = {
      ...data,
      ...product,
    }
    return {
      ...normalizedProduct,
      isToggled: false,
      calcedMacro: calcMacroByQuantity(normalizedProduct.macro, normalizedProduct.quantity)
    }
  });
  return {
    meal: normalizedMeal,
    products: normalizedProducts,
  }
}

export const getRevertedTemplateId = (
  templateId: TemplateId
): TemplateIdReverted => {
  return <any>(<any>templateId * -1);
}