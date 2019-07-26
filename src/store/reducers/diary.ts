import {
  ADD_MEALS,
  UPDATE_MEAL_PRODUCT,
  DELETE_MEAL,
  DELETE_MEAL_PRODUCT,
  ADD_MEAL_PRODUCT,
  UPDATE_MEAL,
  CLEAR_DIARY,
  MEAL_CREATED,
  MEAL_UPDATED,
  MEAL_DELETED,
  MEAL_PRODUCT_CREATED,
  MEAL_PRODUCT_DELETED,
  PRODUCT_UPDATED
} from '../consts';
import { Product, Meal } from '../../entities';
import { DiaryActions } from '../actions/diary';

const initialState: DiaryReducerState = {
  meals: [],
  products: [],
  isLoading: false
}

export function diaryReducer(
  state = initialState,
  action: DiaryActions
): DiaryReducerState {
  switch(action.type) {
    case ADD_MEALS: {
      const { payload } = action;
      
      const { meals, products } = payload.reduce((normalized, meal) => {
        meal.products = meal.products.map(product => {
          normalized.products[product.id] = product;
          return product.id;
        });
        normalized.meals[meal.id] = meal;
        return normalized;
      }, { meals: {}, products: {} });

      return {
        ...state,
        meals: { ...state.meals, ...meals },
        products: { ...state.products, ...products }
      }
    }
    case MEAL_CREATED: return {
      ...state,
      meals: [...state.meals, action.payload]
    }
    case MEAL_UPDATED: return {
      ...state,
      meals: state.meals.map(meal => meal.id === action.meta.mealId
        ? { ...meal, ...action.payload }
        : meal
      )
    }
    case MEAL_DELETED: return {
      ...state,
      meals: state.meals.filter(meal => meal.id !== action.meta.mealId)
    }
    case MEAL_PRODUCT_CREATED: return {
      ...state,
      meals: state.meals.map(meal => meal.id === action.meta.mealId 
        ? { ...meal, products: [...(meal as any).products, action.payload.id] }
        : meal
      ),
      products: [...state.products, action.payload]
    }
    case MEAL_PRODUCT_DELETED: return {
      ...state,
      meals: state.meals.map(meal => meal.id === action.meta.mealId
        ? {
            ...meal,
            products: meal.products.filter(productId =>
              productId !== action.meta.productId
            )
          }
        : meal
      ),
      products: state.products.filter(product => product.id !== action.meta.productId)
    }
    case PRODUCT_UPDATED:
    case MEAL_PRODUCT_UPDATED: return {
      ...state,
      products: state.products.map(product => product.id === action.meta.productId
        ? { ...product, ...action.payload }
        : product
      )
    }
    case ADD_MEAL_PRODUCT: {
      const { mealId, payload } = action;
      const { [mealId]: meal, ...meals } = state.meals;

      return {
        ...state,
        meals: {
          ...meals,
          [mealId]: { ...meal, products: [ ...meal.products, payload.id ] }
        },
        products: { ...state.products, [payload.id]: payload }
      }
    }
    case UPDATE_MEAL: {
      const { mealId, payload } = action;
      const { [mealId]: meal, ...meals } = state.meals;

      return {
        ...state,
        meals: {
          ...meals,
          [mealId]: { ...meal, ...payload }
        }
      }
    }
    case DELETE_MEAL_PRODUCT: {
      const { mealId, productId } = action;
      const { [productId.toString()]: deletedProduct, ...products } = state.products;
      const meal = state.meals[mealId];

      return {
        ...state,
        meals: {
          ...state.meals,
          [mealId]: {
            ...meal,
            products: meal.products.filter(id => id != productId)
          }
        },
        products
      }
    }
    case DELETE_MEAL: {
      const { mealId } = action;
      const { [mealId.toString()]: deletedMeal , ...meals } = state.meals;
      const products = { ...state.products };

      for (let id of deletedMeal.products) {
        delete products[id];
      }
      
      return {
        ...state,
        meals,
        products
      }
    }
    case UPDATE_MEAL_PRODUCT: {
      const { productId, payload } = action;
      const { [productId]: product, ...products } = state.products;

      return {
        ...state,
        products: {
          ...products,
          [productId]: { ...product, ...payload }
        }
      }
    }
    case CLEAR_DIARY: return { ...state, meals: {}, products: {} }
    default: return state;
  }
}


interface DiaryReducerState {
  meals: Meal[]
  products: Product[]
  isLoading: boolean
  // products: {
  //   [productId: string]: Product
  // }
}