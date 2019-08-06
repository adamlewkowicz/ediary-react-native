import { DiaryMeal, DiaryProduct } from '../reducers/diary';
import { BASE_MACRO_ELEMENTS, MACRO_ELEMENTS } from '../../common/consts';
import { MacroElements } from '../../types';
import { AppState } from '..';
import { createSelector } from 'reselect';
import { macroNeeds } from './user';

const baseMacro: MacroElements = { carbs: 0, prots: 0, fats: 0, kcal: 0 };

export const mergedMealSelector = (
  meals: DiaryMeal[],
  products: DiaryProduct[]
) => (
  meals.map(meal => ({
    ...meal,
    products: meal.products.flatMap(productId => {
      const foundProduct = products.find(product => product.id === productId);
      return foundProduct ? [foundProduct] : [];
    })
  }))
);

const meals = (state: AppState) => state.diary.meals;
const products = (state: AppState) => state.diary.products;

const calcedProducts = createSelector(
  products,
  products => products.map(product => ({
    ...product,
    carbs: Math.round(product.carbs * product.quantity / 100),
    prots: Math.round(product.prots * product.quantity / 100),
    fats: Math.round(product.fats * product.quantity / 100),
    kcal: Math.round(product.kcal * product.quantity / 100)
  })
));

const mealsWithProducts = createSelector(
  meals,
  calcedProducts,
  (meals, products) => meals.map(meal => ({
    ...meal,
    productIds: meal.products,
    products: meal.products.flatMap(productId => {
      const foundProduct = products.find(product => product.id === productId);
      return foundProduct ? [foundProduct] : []
    })
  }))
);

const calcedMeals = createSelector(
  mealsWithProducts,
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

export const mealsWithRatio = createSelector(
  calcedMeals,
  meals => meals.map(meal => {
    const macroSum = meal.carbs + meal.prots + meal.fats;
    const macroRatio = BASE_MACRO_ELEMENTS.map(element => ({
      value: meal[element] / macroSum,
      element
    }));

    return { ...meal, macroRatio };
  })
);

const mealsMacroSum = createSelector(
  calcedMeals,
  meals => meals.reduce((sum, meal) => ({
    ...sum,
    carbs: Math.round(sum.carbs + meal.carbs),
    prots: Math.round(sum.prots + meal.prots),
    fats: Math.round(sum.fats + meal.fats),
    kcal: Math.round(sum.kcal + meal.kcal)
  }), { ...baseMacro })
);

export const macroNeedsLeft = createSelector(
  mealsMacroSum,
  macroNeeds,
  (macroSum, macroNeeds) => MACRO_ELEMENTS
    .reduce((result, element) => {
      const diff = Math.round(macroNeeds[element] - macroSum[element]);
      const ratio = Math.floor(
        macroSum[element] / macroNeeds[element] * 100
      );
      return {
        ...result,
        [element]: { diff, ratio, eaten: macroSum[element], needed: macroNeeds[element] }
      }
    }, {
      carbs: { diff: 0, ratio: 0 },
      prots: { diff: 0, ratio: 0 },
      fats: { diff: 0, ratio: 0 },
      kcal: { diff: 0, ratio: 0 },
    })
);

export type MacroNeedsLeft = ReturnType<typeof macroNeedsLeft>;
export type MealsWithRatio = ReturnType<typeof mealsWithRatio>;