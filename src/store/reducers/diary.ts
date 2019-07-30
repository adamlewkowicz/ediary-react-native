import {
  MEAL_CREATED,
  MEAL_UPDATED,
  MEAL_DELETED,
  MEAL_PRODUCT_CREATED,
  MEAL_PRODUCT_DELETED,
  PRODUCT_UPDATED,
  MEAL_TOGGLED,
} from '../consts';
import { Meal } from '../../entities';
import { ProductUnit, MacroElement } from '../../types';
import { DiaryActions } from '../actions';
import { calcMacroByQuantity } from '../helpers/diary';
import dayjs from 'dayjs';

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
        {
          ...action.payload,
          day: dayjs(action.payload.date).format('YYYY-MM-DD'),
          isToggled: true,
          products: []
        }
      ]
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
      meals: state.meals.map(meal => meal.id === action.meta.mealId
        ? { ...meal, ...action.payload }
        : meal
      )
    }
    case MEAL_DELETED: return {
      ...state,
      meals: state.meals.filter(meal => meal.id !== action.meta.mealId),
      products: state.products.filter(product => product.mealId !== action.meta.mealId)
    }
    case MEAL_PRODUCT_CREATED: return {
      ...state,
      meals: state.meals.map(meal => meal.id === action.meta.mealId 
        ? { ...meal, products: [...meal.products, action.payload.id] }
        : meal
      ),
      products: [
        ...state.products,
        {
          ...action.payload,
          macro: calcMacroByQuantity(action.payload)
        }
      ]
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
      products: state.products.map(product => {
        if (product.id === action.meta.productId) {
          const merged = { ...product, ...action.payload };
          if (
            'quantity' in action.payload &&
            action.payload.quantity !== product.quantity
          ) {
            return {
              ...merged,
              macro: calcMacroByQuantity(merged)
            }
          }
          return merged;
        }
        return product;
      })
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
  isToggled: boolean
  day: string
  date: string
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
  macro: {
    element: MacroElement
    value: number
  }[]
  mealId: Meal['id'] | null
  userId?: number | null
  updatedAt: Date
  createdAt: Date
}

export type ProductStateArray = ProductState[]

interface DiaryReducerState {
  meals: MealStateArray
  products: ProductState[]
  isLoading: boolean
}