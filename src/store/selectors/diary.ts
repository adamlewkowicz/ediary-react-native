import { BASE_MACRO_ELEMENTS } from '../../common/consts';
import { MacroElements } from '../../types';
import { StoreState } from '..';
import { createSelector } from 'reselect';
import { getMacroNeeds } from './user';
import { calcMacroNeedsLeft } from '../../common/utils';

const baseMacro: MacroElements = { carbs: 0, prots: 0, fats: 0, kcal: 0 };

const getMeals = (state: StoreState) => state.diary.meals;
const getProducts = (state: StoreState) => state.diary.products;

const getCalcedProducts = createSelector(
  getProducts,
  products => products.map(product => ({
    ...product,
    carbs: Math.round(product.macro.carbs * product.quantity / 100),
    prots: Math.round(product.macro.prots * product.quantity / 100),
    fats: Math.round(product.macro.fats * product.quantity / 100),
    kcal: Math.round(product.macro.kcal * product.quantity / 100)
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
    }), { ...baseMacro });

    return { ...meal, ...summedMacro }
  })
);

export const getMealsWithRatio = createSelector(
  getCalcedMeals,
  meals => meals
    .map(meal => {
      const macroSum = meal.carbs + meal.prots + meal.fats;
      const macroRatio = BASE_MACRO_ELEMENTS.map(element => ({
        value: meal[element] / macroSum,
        element
      }));
      return { ...meal, macroRatio };
    })
    .sort((a, b) => {
      const timeA = Number(a.time.replace(/:/g, ''));
      const timeB = Number(b.time.replace(/:/g, ''));
      return timeA > timeB ? 1 : -1;
    })
);

const getMealsMacroSum = createSelector(
  getCalcedMeals,
  meals => meals.reduce((sum, meal) => ({
    ...sum,
    carbs: Math.round(sum.carbs + meal.carbs),
    prots: Math.round(sum.prots + meal.prots),
    fats: Math.round(sum.fats + meal.fats),
    kcal: Math.round(sum.kcal + meal.kcal)
  }), { ...baseMacro })
);

export const getMacroNeedsLeft = createSelector(
  getMealsMacroSum,
  getMacroNeeds,
  (macroSum, macroNeeds) => calcMacroNeedsLeft(macroSum, macroNeeds)
);

export type GetMacroNeedsLeft = ReturnType<typeof getMacroNeedsLeft>;
export type GetMealsWithRatio = ReturnType<typeof getMealsWithRatio>;