import { MacroElements } from '../../types';
import { StoreState } from '..';
import { createSelector } from 'reselect';
import { getMacroNeeds } from './user';
import { calcMacroNeedsLeft, calculatePercentage } from '../../common/utils';

const BASE_MACRO: MacroElements = { carbs: 0, prots: 0, fats: 0, kcal: 0 };

const getMeals = (state: StoreState) => state.diary.meals;

const getProducts = (state: StoreState) => state.diary.products;

const getCalcedProducts = createSelector(
  getProducts,
  products => products.map(product => ({
    ...product,
    carbs: calculatePercentage(product.macro.carbs, product.quantity),
    prots: calculatePercentage(product.macro.prots, product.quantity),
    fats: calculatePercentage(product.macro.fats, product.quantity),
    kcal: calculatePercentage(product.macro.kcal, product.quantity)
  })
));

const getMealsWithProducts = createSelector(
  getMeals,
  getCalcedProducts,
  (meals, products) => meals.map(meal => ({
    ...meal,
    products: meal.productIds.flatMap(productId => {
      const foundProduct = products.find(product => product.id === productId);
      return foundProduct ? [foundProduct] : []
    })
  }))
);

export const getCalcedMeals = createSelector(
  getMealsWithProducts,
  meals => meals.map(meal => {
    const summedMacro = meal.products.reduce((macro, product) => ({
      ...macro,
      carbs: macro.carbs += product.carbs,
      prots: macro.prots += product.prots,
      fats: macro.fats += product.fats,
      kcal: macro.kcal += product.kcal,
    }), { ...BASE_MACRO });

    return { ...meal, ...summedMacro, macro: summedMacro };
  })
);

export const getMealsWithRatio = createSelector(
  getCalcedMeals,
  meals => meals
    .map(meal => {
      const macroSum = meal.macro.carbs + meal.macro.prots + meal.macro.fats;
      return {
        ...meal,
        macroPercentages: {
          carbs: calculatePercentage(meal.macro.carbs, macroSum),
          prots: calculatePercentage(meal.macro.prots, macroSum),
          fats: calculatePercentage(meal.macro.fats, macroSum),
        }
      }
    })
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

export const getMacroNeedsLeft = createSelector(
  getMealsMacroSum,
  getMacroNeeds,
  (macroSum, macroNeeds) => calcMacroNeedsLeft(macroSum, macroNeeds)
);

export type MealsWithRatio = ReturnType<typeof getMealsWithRatio>;
export type MealWithRatio = MealsWithRatio[number];