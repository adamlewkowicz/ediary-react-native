import { MacroElements } from '../../types';
import { StoreState } from '..';
import { createSelector } from 'reselect';
import { getMacroNeeds } from './user';
import { calculateMacroPercentages, calculateMacroNeeds } from '../../common/utils';

const BASE_MACRO: MacroElements = { carbs: 0, prots: 0, fats: 0, kcal: 0 };

const getMeals = (state: StoreState) => state.diary.meals;

const getProducts = (state: StoreState) => state.diary.products;

const getMealsWithProducts = createSelector(
  getMeals,
  getProducts,
  (meals, products) => meals.map(meal => ({
    ...meal,
    products: meal.productIds.flatMap(productId => {
      const foundProduct = products.find(product => product.data.id === productId);
      return foundProduct ?? [];
    })
  }))
);

export const getCalcedMeals = createSelector(
  getMealsWithProducts,
  meals => meals.map(meal => {
    const calcedMacro = meal.products.reduce((macro, product) => ({
      ...macro,
      carbs: macro.carbs += product.calcedMacro.carbs,
      prots: macro.prots += product.calcedMacro.prots,
      fats: macro.fats += product.calcedMacro.fats,
      kcal: macro.kcal += product.calcedMacro.kcal,
    }), { ...BASE_MACRO });

    const macroPercentages = calculateMacroPercentages(calcedMacro);

    return {
      ...meal,
      ...calcedMacro,
      calcedMacro,
      macroPercentages
    };
  })
);

export const getMealsWithRatio = createSelector(
  getCalcedMeals,
  meals => meals
    .sort((a, b) => {
      const timeA = Number(a.time.replace(/:/g, ''));
      const timeB = Number(b.time.replace(/:/g, ''));
      return timeA > timeB ? 1 : -1;
    })
);

const getMealsMacroSum = createSelector(
  getCalcedMeals,
  (meals): MacroElements => meals.reduce((sum, meal) => ({
    ...sum,
    carbs: Math.round(sum.carbs + meal.carbs),
    prots: Math.round(sum.prots + meal.prots),
    fats: Math.round(sum.fats + meal.fats),
    kcal: Math.round(sum.kcal + meal.kcal)
  }), { ...BASE_MACRO })
);

export const getCalcedMacroNeeds = createSelector(
  getMealsMacroSum,
  getMacroNeeds,
  calculateMacroNeeds
);

export type MealsWithRatio = ReturnType<typeof getMealsWithRatio>;
export type MealWithRatio = MealsWithRatio[number];
export type MacroNeeds = ReturnType<typeof getCalcedMacroNeeds>;