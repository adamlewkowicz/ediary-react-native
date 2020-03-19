import {
  MEAL_UPDATED,
  MEAL_DELETED,
  MEAL_PRODUCT_DELETED,
  PRODUCT_QUANTITY_UPDATED,
  MEAL_TOGGLED,
  MEAL_PRODUCT_ADDED,
  MEAL_ADDED,
  MEALS_LOADED,
} from '../../consts';
import {
  getMealFromTemplate,
  normalizeMeals,
  normalizeMeal,
} from './helpers';
import { DiaryAction } from '../../actions';
import { DiaryState } from './types';
import { defaultTemplates } from '../../../common/helpers';
import { calculateMacroPerQuantity } from '../../../common/utils';

const initialState: DiaryState = {
  meals: [],
  products: [],
  templates: defaultTemplates
}

export function diaryReducer(
  state = initialState,
  action: DiaryAction
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
      const { meal: normalizedMeal, products: normalizedProducts } = normalizeMeal(action.payload);
      const foundTemplate = state.templates.find(template =>
        template.name === normalizedMeal.name
      );
      const isMealCreatedFromTemplate = foundTemplate !== undefined;
      
      if (isMealCreatedFromTemplate) {
        return {
          ...state,
          products: [...state.products, ...normalizedProducts],
          meals: state.meals.map(meal => {
            if (meal.type === 'template' && meal.templateId === foundTemplate?.id) {
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
          const foundTemplate = state.templates.find(template => 
            template.name === meal.name  
          );
          if (foundTemplate) {
            const mealFromTemplate = getMealFromTemplate(foundTemplate);
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
          data: action.meta.rawProduct,
          _calcedMacro: calculateMacroPerQuantity(action.payload.macro, action.payload.quantity),
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
    case PRODUCT_QUANTITY_UPDATED: return {
      ...state,
      products: state.products.map(product => {
        if (product.id === action.meta.productId) {
          const quantity = action.payload;
          return {
            ...product,
            quantity,
            _calcedMacro: calculateMacroPerQuantity(product.data.macro, quantity)
          }
        }
        return product;
      })
    }
    default: return state;
  }
}

export { initialState as diaryInitialState };