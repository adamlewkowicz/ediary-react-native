import { BASE_MACRO_ELEMENTS, MACRO_ELEMENTS } from '../../common/consts';
import { MacroElements } from '../../types';
import { StoreState } from '..';
import { createSelector } from 'reselect';
import { macroNeeds } from './user';
import { Template } from '../reducers/diary';

const baseMacro: MacroElements = { carbs: 0, prots: 0, fats: 0, kcal: 0 };
const macroNeedsElement = { diff: 0, ratio: 0, eaten: 0, needed: 0 };

const meals = (state: StoreState) => state.diary.meals;
const products = (state: StoreState) => state.diary.products;
const templates = (state: StoreState) => state.diary.templates;

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
    products: meal.productIds.flatMap(productId => {
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

const mealsWithRatio = createSelector(
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
        [element]: {
          diff,
          ratio,
          eaten: macroSum[element],
          needed: macroNeeds[element]
        }
      }
    }, {
      carbs: { ...macroNeedsElement },
      prots: { ...macroNeedsElement },
      fats: { ...macroNeedsElement },
      kcal: { ...macroNeedsElement }
    })
);

export const mealsAndTemplates = createSelector(
  mealsWithRatio,
  templates,
  (meals, templates): MealsAndTemplates => {
    const usedTemplateIds = meals.flatMap(meal => meal.templateId ? [meal.templateId] : []);
    const parsedMeals = meals.map(meal => ({
      ...meal,
      type: 'meal' as 'meal'
    }));
    const parsedTemplates = templates
      .map(template => ({
        ...template,
        type: 'template' as 'template'
      }))
      .filter(template => !usedTemplateIds.includes(template.id));

    const sorted = [...parsedMeals, ...parsedTemplates]
      .sort((a, b) => {
        const timeA = Number(a.time.replace(/:/g, ''));
        const timeB = Number(b.time.replace(/:/g, ''));
        return timeA > timeB ? 1 : -1;
      });

    return sorted;
  }
);

export type MealsAndTemplates = (
  (MealsWithRatio[number] & { type: 'meal' }) |
  (Template & { type: 'template' })
)[];

export type MacroNeedsLeft = ReturnType<typeof macroNeedsLeft>;
export type MealsWithRatio = ReturnType<typeof mealsWithRatio>;