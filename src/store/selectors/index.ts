import { DiaryMeal, DiaryProduct } from '../reducers/diary';
import { BASE_MACRO_ELEMENTS } from '../../common/consts';
import { MacroElements } from '../../types';
import { AppState } from '..';
import { createSelector } from 'reselect';

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

export type MealsWithRatio = ReturnType<typeof mealsWithRatio>;