import {
  MEAL_DELETED,
  MEAL_PRODUCT_DELETED,
  PRODUCT_QUANTITY_UPDATED,
  MEAL_OPEN_TOGGLED,
  MEAL_PRODUCT_ADDED,
  MEAL_ADDED,
  MEALS_LOADED,
  MEAL_PRODUCT_ADD_STARTED,
  MEAL_PRODUCT_ADD_FINISHED,
} from '../../consts';
import {
  getDiaryMealTemplate,
  normalizeProductEntity,
  normalizeMealEntities,
  normalizeMealEntity,
  isEqualMealId,
} from './helpers';
import { DiaryAction } from '../../actions';
import { DiaryState } from './types';
import { DEFAULT_MEAL_TEMPLATES } from './consts';
import * as Utils from '../../../utils';

const initialState: DiaryState = {
  meals: [],
  products: [],
  templates: DEFAULT_MEAL_TEMPLATES
}

export function diaryReducer(
  state = initialState,
  action: DiaryAction
): DiaryState {
  switch(action.type) {
    case MEALS_LOADED:
      const { meals, products } = normalizeMealEntities(action.payload);

      return {
        ...state,
        products,
        meals: [
          ...state.templates.flatMap(mealTemplate => {
            if (meals.some(meal => meal.data.name === mealTemplate.name)) {
              return [];
            }
            const diaryMealTemplate = getDiaryMealTemplate(mealTemplate);
            return diaryMealTemplate;
          }),
          ...meals
        ]
      }
    case MEAL_ADDED: {
      const { meal: normalizedMeal, products: normalizedProducts } = normalizeMealEntity(action.payload);
      const foundTemplate = state.templates.find(template =>
        template.name === normalizedMeal.data.name
      );
      const isMealCreatedFromTemplate = foundTemplate !== undefined;
      
      if (isMealCreatedFromTemplate) {
        return {
          ...state,
          products: [...state.products, ...normalizedProducts],
          meals: state.meals.map(meal => {
            // TODO: refactor
            if (meal.type === 'template' && meal.data.name === foundTemplate?.name) {
              return { ...normalizedMeal, isOpened: true };
            }
            return meal;
          })
        }
      }
      return {
        ...state,
        products: [...state.products, ...normalizedProducts],
        meals: [...state.meals, { ...normalizedMeal, isOpened: true }]
      }
    }
    case MEAL_DELETED: return {
      ...state,
      products: state.products.filter(product =>
        product.mealId !== action.meta.mealId
      ),
      meals: state.meals.flatMap(meal => {
        if (meal.data.id === action.meta.mealId) {
          const foundTemplate = state.templates.find(template => 
            template.name === meal.data.name  
          );
          if (foundTemplate) {
            const diaryMealTemplate = getDiaryMealTemplate(foundTemplate);
            return diaryMealTemplate;
          }
          return [];
        }
        return meal;
      })
    }
    case MEAL_OPEN_TOGGLED: return {
      ...state,
      meals: state.meals.map(meal => ({
        ...meal,
        isOpened: action.meta.mealId === meal.data.id
          ? !meal.isOpened
          : false
      }))
    }
    case MEAL_PRODUCT_ADD_STARTED: return {
      ...state,
      meals: state.meals.map(meal => isEqualMealId(meal, action.meta.mealId)
        ? { ...meal, isAddingProduct: true }
        : meal
      )
    }
    case MEAL_PRODUCT_ADD_FINISHED: return {
      ...state,
      meals: state.meals.map(meal => isEqualMealId(meal, action.meta.mealId) && meal.isAddingProduct
        ? { ...meal, isAddingProduct: false }
        : meal
      )
    }
    case MEAL_PRODUCT_ADDED:
      const normalizedProduct = normalizeProductEntity(
        action.payload, 
        action.payload.mealId,
        action.payload.quantity
      );
      
      return {
        ...state,
        meals: state.meals.map(meal => {
          if (isEqualMealId(meal, action.meta.mealId)) {
            return {
              ...meal,
              productIds: [...meal.productIds, normalizedProduct.data.id],
              isAddingProduct: false,
            }
          }
          return meal;
        }),
        products: [...state.products, normalizedProduct]
      }
    case MEAL_PRODUCT_DELETED: return {
      ...state,
      meals: state.meals.map(meal => {
        if (isEqualMealId(meal, action.meta.mealId)) {
          const productIds = meal.productIds.filter(productId =>
            productId !== action.meta.productId
          );
          return { ...meal, productIds };
        }
        return meal;
      }),
      products: state.products.filter(product => product.data.id !== action.meta.productId)
    }
    case PRODUCT_QUANTITY_UPDATED: return {
      ...state,
      products: state.products.map(product => {
        if (product.data.id === action.meta.productId) {
          const quantity = action.payload;
          return {
            ...product,
            quantity,
            calcedMacro: Utils.calculateMacroPerQuantity(product.data.macro, quantity)
          }
        }
        return product;
      })
    }
    default: return state;
  }
}

export { initialState as diaryInitialState };