import {
  MEAL_UPDATED,
  MEAL_DELETED,
  MEAL_PRODUCT_DELETED,
  PRODUCT_UPDATED,
  MEAL_TOGGLED,
  PRODUCT_TOGGLED,
  MEAL_PRODUCT_ADDED,
  MEAL_ADDED,
  MEALS_LOADED,
} from '../../consts';
import {
  calcMacroByQuantity,
  getRevertedTemplateId,
  normalizeMeal,
} from './helpers';
import { DiaryActions } from '../../actions';
import { getDayFromDate, getTimeFromDate } from '../../../common/utils';
import { DiaryState, DiaryMeal, DiaryMealTemplate, DiaryMealType } from './types';
import { defaultTemplates } from '../../../common/helpers';

const initialState: DiaryState = {
  meals: [],
  products: [],
  templates: defaultTemplates as any
}

export function diaryReducer(
  state = initialState,
  action: DiaryActions
): DiaryState {
  switch(action.type) {
    case MEALS_LOADED: return {
      ...state,
      meals: [
        ...state.templates.flatMap(template => {
          if (action.payload.some(meal => meal.name === template.name)) {
            return [];
          }
          const type: DiaryMealType = 'template';
          return [{
            id: getRevertedTemplateId(template.id),
            name: template.name,
            macro: {
              carbs: 0,
              prots: 0,
              fats: 0,
              kcal: 0,
            },
            day: null,
            date: null,
            time: template.time,
            isToggled: false,
            templateId: template.id,
            productIds: [],
            type,
          }];
        }),
        ...action.payload.map(meal => {
          const { mealProducts = [], ...data } = meal;
          const type: DiaryMeal['type'] = 'meal';
          return {
            ...data,
            isToggled: false,
            day: getDayFromDate(meal.date),
            time: getTimeFromDate(meal.date),
            templateId: null,
            productIds: mealProducts.map(mealProduct => mealProduct.productId),
            type,
          }
        })
      ],
      products: action.payload.flatMap(({ mealProducts = [] }) => {
        return mealProducts.map(mealProduct => {
          const { meal, product, ...data } = mealProduct;
          const normalizedProduct = {
            ...data,
            ...product,
          }
          return {
            ...normalizedProduct,
            isToggled: false,
            calcedMacro: calcMacroByQuantity(normalizedProduct.macro, normalizedProduct.quantity)
          }
        })
      })
    }
    case MEAL_ADDED: {
      const { templateId } = action.meta;
      const { meal: normalizedMeal, products } = normalizeMeal(action.payload, templateId);

      if (templateId !== null) {
        return {
          ...state,
          products: [...state.products, ...products],
          meals: state.meals.map(meal => {
            if (meal.type === 'template' && meal.templateId === templateId) {
              return { ...normalizedMeal, isToggled: true };
            }
            return meal;
          })
        }
      }
      return {
        ...state,
        products: [...state.products, ...products],
        meals: [...state.meals, { ...normalizedMeal, type: 'meal' }]
      }
    }
    case MEAL_DELETED: return {
      ...state,
      products: state.products.filter(product =>
        product.mealId !== action.meta.mealId
      ),
      meals: state.meals.flatMap(meal => {
        if (meal.id === action.meta.mealId) {
          if (meal.templateId) {
            const { templateId, name, time } = meal;
            return [{
              id: getRevertedTemplateId(meal.templateId),
              macro: {
                carbs: 0,
                prots: 0,
                fats: 0,
                kcal: 0,
              },
              day: null,
              date: null,
              type: 'template',
              isToggled: false,
              productIds: [],
              templateId,
              name,
              time,
            }]
          }
          return [];
        }
        return [meal];
      })
    }
    case MEAL_TOGGLED: return {
      ...state,
      meals: state.meals.map(meal => ({
        ...meal,
        isToggled: action.meta.mealId === meal.id
          ? !meal.isToggled
          : false
      }))
    }
    case MEAL_UPDATED: return {
      ...state,
      meals: state.meals.map(meal =>
        meal.type === 'meal' && meal.id === action.meta.mealId
          ? { ...meal, ...action.payload }
          : meal
      )
    }
    case MEAL_PRODUCT_ADDED: return {
      ...state,
      meals: state.meals.map(meal => 
        meal.type === 'meal' && meal.id === action.meta.mealId 
          ? { ...meal, productIds: [...meal.productIds, action.payload.id] }
          : meal
      ),
      products: [
        ...state.products,
        {
          ...action.payload,
          isToggled: false,
          calcedMacro: calcMacroByQuantity(action.payload.macro, action.payload.quantity),
        }
      ]
    }
    case MEAL_PRODUCT_DELETED: return {
      ...state,
      meals: state.meals.map(meal => {
        if (meal.type === 'meal' && meal.id === action.meta.mealId) {
          const productIds = meal.productIds.filter(productId =>
            productId !== action.meta.productId
          );
          return { ...meal, productIds };
        }
        return meal;
      }),
      products: state.products.filter(product => product.id !== action.meta.productId)
    }
    case PRODUCT_UPDATED: return {
      ...state,
      products: state.products.map(product => {
        if (product.id === action.meta.productId) {
          const merged = { ...product, ...action.payload };
          if (
            'quantity' in action.payload &&
            action.payload.quantity !== product.quantity
          ) {
            return {
              ...merged,
              calcedMacro: calcMacroByQuantity(merged.macro, merged.quantity)
            }
          }
          return merged;
        }
        return product;
      })
    }
    case PRODUCT_TOGGLED: return {
      ...state,
      products: state.products.map(product => ({
        ...product,
        isToggled: action.payload === product.id
          ? !product.isToggled
          : false
      }))
    }
    default: return state;
  }
}

export { initialState as diaryInitialState };