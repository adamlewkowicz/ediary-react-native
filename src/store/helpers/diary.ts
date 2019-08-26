import { MacroElements, DateTime } from '../../types';
import { MACRO_ELEMENTS } from '../../common/consts';
import { Meal } from '../../database/entities';
import { getDayFromDate, getTimeFromDate } from '../../common/utils';

interface CalcMacroByQuantityData extends MacroElements {
  quantity: number
}
export const calcMacroByQuantity = <T extends CalcMacroByQuantityData>(
  macroData: T
) => MACRO_ELEMENTS.map(element => ({
  value: Math.round(macroData[element] * macroData.quantity / 100),
  element
}));

export const getDataFromTemplate = (template: Template) => ({
  carbs: 0,
  prots: 0,
  fats: 0,
  kcal: 0,
});

interface Template {
  name: string
  time: DateTime
}

export const normalizeMeals = <T extends Meal[]>(
  payload: T
) => {
  const meals = payload.map(meal => {
    const { mealProducts, ...data } = meal;
    return {
      ...data,
      isToggled: false,
      isTemplate: false,
      day: getDayFromDate(meal.date),
      time: getTimeFromDate(meal.date),
      productIds: mealProducts.map(mealProduct => mealProduct.productId),
      templateId: null,
    }
  });
  const products = payload.flatMap(meal => {
    return meal.mealProducts.map(mealProduct => {
      const { meal, product, ...data } = mealProduct;
      const normalizedProduct = {
        ...data,
        ...product,
      }
      return {
        ...normalizedProduct,
        isToggled: false,
        macro: calcMacroByQuantity(normalizedProduct)
      }
    })
  });
  return { meals, products };
}