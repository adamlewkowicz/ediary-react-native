import { MealState, ProductState } from '../reducers/diary';
import { MACRO_ELEMENTS, BASE_MACRO_ELEMENTS } from '../../common/consts';
import { MacroElements, BaseMacroElement, BaseMacroElements } from '../../types';
import { AppState } from '..';

const baseMacro: MacroElements = { carbs: 0, prots: 0, fats: 0, kcal: 0 };

export const mergedMealSelector = (
  meals: MealState[],
  products: ProductState[]
) => (
  meals.map(meal => ({
    ...meal,
    products: meal.products.flatMap(productId => {
      const foundProduct = products.find(product => product.id === productId);
      return foundProduct ? [foundProduct] : [];
    })
  }))
);

export const calcedMealSelector = (
  meals: ReturnType<typeof mergedMealSelector>
) => meals.map(meal => {

  const calcedProducts = meal.products.map(product => ({
    ...product,
    ...MACRO_ELEMENTS.reduce((macro, element) => ({
      ...macro,
      [element]: product[element] * product.quantity
    }), { ...baseMacro })
  }));

  const mealMacro = calcedProducts.reduce((macro, product) => {
    for (const element of MACRO_ELEMENTS) {
      macro[element] += product[element];
    }
    return macro;
  }, { ...baseMacro });

  return {
    ...meal,
    ...mealMacro,
    products: calcedProducts
  }
});

export const dailyEatenMacro = (
  day: string,
  meals: CalcedMealSelectorResult
): MacroElements => meals
  // .filter(meal => meal.day === day)
  .reduce((macro, meal) => {
    for (const element of MACRO_ELEMENTS) {
      macro[element] += meal[element];
    }
    return macro;
  }, { ...baseMacro });

export const calcedProducts = (products: AppState['diary']['products']) => products.map(calcMacroOnQuantity);

export const getMacroRatio = <T extends BaseMacroElements>(
  macroData: T
) => {
  const macroWeightSum = macroData.carbs + macroData.prots + macroData.fats;

  return BASE_MACRO_ELEMENTS.map(element => ({
    value: Math.round(macroData[element] / macroWeightSum * 100),
    element
  }));
}

interface CalcMacroOnQuantityData extends MacroElements {
  quantity: number
}
export const calcMacroOnQuantity = <T extends CalcMacroOnQuantityData>(
  macroData: T
) => MACRO_ELEMENTS.map(element => ({
  value: Math.round(macroData[element] * macroData.quantity / 100),
  element
}));

export type CalcedMealSelectorResult = ReturnType<typeof calcedMealSelector>;