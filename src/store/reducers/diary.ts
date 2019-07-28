import {
  MEAL_CREATED,
  MEAL_UPDATED,
  MEAL_DELETED,
  MEAL_PRODUCT_CREATED,
  MEAL_PRODUCT_DELETED,
  PRODUCT_UPDATED,
} from '../consts';
import { Meal } from '../../entities';
import { ProductUnit } from '../../types';
import { DiaryActions } from '../action-types';

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
    case MEAL_CREATED: return {
      ...state,
      meals: [
        ...state.meals,
        { ...action.payload, products: [] }
      ]
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
      meals: state.meals.map(meal => {
        if (meal.id === action.meta.mealId) {
          const productIds = meal.products.filter(productId =>
            productId !== action.meta.productId
          );
          return {
            ...meal,
            products: productIds
          }
        }
        return meal;
      }),
      products: state.products.filter(product => product.id !== action.meta.productId)
    }
    case PRODUCT_UPDATED: return {
      ...state,
      products: state.products.map(product => product.id === action.meta.productId
        ? { ...product, ...action.payload }
        : product
      )
    }
    default: return state;
  }
}

export type MealState = {
  id: number
  name: string
  carbs: number
  prots: number
  fats: number
  kcal: number
  updatedAt?: number
  createdAt?: number
  /** List of meal's product ids */
  products: number[]
}

export type MealStateArray = MealState[];

export interface ProductState {
  id: number
  name: string
  producer?: string | null
  img?: string
  barcode: string | null
  quantity: number
  unit: ProductUnit
  carbs: number
  prots: number
  fats: number
  kcal: number
  mealId: Meal['id']
  userId?: number
  updatedAt: Date
  createdAt: Date
}

export type ProductStateArray = ProductState[]

interface DiaryReducerState {
  meals: MealStateArray
  products: ProductState[]
  isLoading: boolean
}