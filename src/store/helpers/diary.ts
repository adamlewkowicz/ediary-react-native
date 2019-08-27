import { MacroElements, DateTime, TemplateId, TemplateIdReverted } from '../../types';
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
  payload: T,
  templateId: TemplateId | null = null,
) => {
  const meals = payload.map(meal => {
    const { mealProducts, ...data } = meal;
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

export const normalizeMeal = (
  meal: Meal,
  templateId: TemplateId | null = null,
) => {
  const { mealProducts, ...data } = meal;
  const normalizedMeal = {
    ...data,
    isToggled: false,
    isTemplate: templateId != null,
    day: getDayFromDate(meal.date),
    time: getTimeFromDate(meal.date),
    productIds: mealProducts.map(mealProduct => mealProduct.productId),
    templateId
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
      macro: calcMacroByQuantity(normalizedProduct)
    }
  });
  return {
    meal: normalizedMeal,
    products: normalizedProducts,
  }
}

// export const getEmptyMealFromTemplate = (
//   template: DiaryTemplate
// )

export const getRevertedTemplateId = (
  templateId: TemplateId
): TemplateIdReverted => {
  return <any>(<any>templateId * -1);
}