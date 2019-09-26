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
  getMealFromTemplate,
  normalizeMeals,
  normalizeMeal,
} from './helpers';
import { DiaryActions } from '../../actions';
import { DiaryState } from './types';
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
    case MEALS_LOADED:
      const { meals, products } = normalizeMeals(action.payload);
      return {
        ...state,
        products,
        meals: [
          ...state.templates.flatMap(template => {
            if (meals.some(meal => meal.name === template.name)) {
              return [];
            }
            const mealTemplate = getMealFromTemplate(template);
            return [mealTemplate];
          }),
          ...meals
        ]
      }
    case MEAL_ADDED: {
      const { templateId } = action.meta;
      const isMealCreatedFromTemplate = templateId !== null;
      const { meal: normalizedMeal, products: normalizedProducts } = normalizeMeal(
        action.payload, action.meta.templateId
      );
      
      if (isMealCreatedFromTemplate) {
        return {
          ...state,
          products: [...state.products, ...normalizedProducts],
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
        products: [...state.products, ...normalizedProducts],
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
            const { templateId: id, name, time } = meal;
            const template = { id, name, time };
            const mealFromTemplate = getMealFromTemplate(template);
            return [mealFromTemplate];
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
        meal.id === action.meta.mealId 
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