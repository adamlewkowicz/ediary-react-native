import { MacroElements } from '../../types';
import { StoreState } from '..';
import { createSelector } from 'reselect';
import { getMacroNeeds } from './user';
import { calculateMacroPercentages, calculateMacroNeeds, reduceObjectsSum, sortByDateTime } from '../../common/utils';

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
      const calcedMacro = meal.products
        .map(product => product.calcedMacro)
        .reduce(reduceObjectsSum);

      const macroPercentages = calculateMacroPercentages(calcedMacro);

      return {
        ...meal,
        ...calcedMacro,
        calcedMacro,
        macroPercentages
      }
    })
    .sort(sortByDateTime)
);

const getMealsMacroSum = createSelector(
  getMealsCalced,
  (meals): MacroElements => meals
    .map(meal => meal.calcedMacro)
    .reduce(reduceObjectsSum)
);

export const getCalcedMacroNeeds = createSelector(
  getMealsMacroSum,
  getMacroNeeds,
  calculateMacroNeeds
);

export type MealsCalced = ReturnType<typeof getMealsCalced>;
export type MealCalced = MealsCalced[number];
export type MacroNeeds = ReturnType<typeof getCalcedMacroNeeds>;