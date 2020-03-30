import { MacroElements } from '../../types';
import { StoreState } from '..';
import { createSelector } from 'reselect';
import { getUserMacroNeeds } from './user';
import * as Utils from '../../utils';
import { MACRO } from '../../common/consts';

const getMeals = (state: StoreState) => state.diary.meals;

const getProducts = (state: StoreState) => state.diary.products;

const getMealsWithProducts = createSelector(
  getMeals,
  getProducts,
  (meals, products) => meals.map(meal => ({
    ...meal,
    products: meal.productIds.flatMap(productId => 
      products.find(product => product.data.id === productId) ?? []
    )
  }))
);

export const getMealsCalced = createSelector(
  getMealsWithProducts,
  meals => meals
    .map(meal => {
      const calcedMacro = meal.type === 'template'
        ? { ...MACRO }
        : Utils.calculateMacroSum(meal.products);

      const macroPercentages = Utils.calculateMacroPercentages(calcedMacro);

      return {
        ...meal,
        calcedMacro,
        macroPercentages
      }
    })
    .sort(Utils.sortByDateTime)
);

const getMealsMacroSum = createSelector(
  getMealsCalced,
  (meals): MacroElements => Utils.calculateMacroSum(meals)
);

export const getCalcedMacroNeeds = createSelector(
  getMealsMacroSum,
  getUserMacroNeeds,
  Utils.calculateMacroNeeds
);

export type MealsCalced = ReturnType<typeof getMealsCalced>;
export type MealCalced = MealsCalced[number];
export type MacroNeeds = ReturnType<typeof getCalcedMacroNeeds>;