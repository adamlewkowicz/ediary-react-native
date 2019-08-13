import {
  MEAL_CREATED,
  MEAL_UPDATED,
  MEAL_DELETED,
  MEAL_PRODUCT_DELETED,
  PRODUCT_UPDATED,
  MEAL_TOGGLED,
  PRODUCT_CREATED,
  MEALS_ADDED,
  PRODUCT_TOGGLED,
  MEAL_PRODUCT_ADDED,
} from '../consts';
import {
  ProductUnit,
  MacroElement,
  BarcodeId,
  ProductId,
  MealId,
  DateDay,
} from '../../types';
import { Meal } from '../../database/entities';
import { DiaryActions } from '../actions';
import { calcMacroByQuantity } from '../helpers/diary';
import { getDayFromDate } from '../../common/utils';

const initialState: DiaryState = {
  meals: [],
  products: [],
  toggledProductId: null,
  isLoading: false
}

export function diaryReducer(
  state = initialState,
  action: DiaryActions
): DiaryState {
  switch(action.type) {
    case MEALS_ADDED: return {
      ...state,
      meals: action.payload.map(meal => {
        const { mealProducts, ...data } = meal;
        return {
          ...data,
          isToggled: false,
          day: getDayFromDate(meal.date),
          products: mealProducts.map(mealProduct => mealProduct.productId)
        }
      }),
      products: action.payload.flatMap(meal => {
        return meal.mealProducts.map(mealProduct => {
          const { meal, product, ...data } = mealProduct;
          const normalizedProduct = {
            ...data,
            ...product,
          }
          return {
            ...normalizedProduct,
            isToggled: false,
            macro: calcMacroByQuantity(normalizedProduct)
          }
        })
      })
    }
    case MEAL_CREATED: return {
      ...state,
      meals: [
        ...state.meals,
        {
          ...action.payload,
          day: getDayFromDate(action.payload.date),
          isToggled: true,
          products: []
        }
      ]
    }
    case MEAL_TOGGLED: return {
      ...state,
      toggledProductId: null,
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
    case MEAL_PRODUCT_ADDED: return {
      ...state,
      meals: state.meals.map(meal => meal.id === action.meta.mealId 
        ? { ...meal, products: [...meal.products, action.payload.id] }
        : meal
      ),
      products: [
        ...state.products,
        {
          ...action.payload,
          isToggled: false,
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
    case PRODUCT_CREATED: return {
      ...state,
      products: [
        ...state.products,
        {
          ...action.payload,
          isToggled: false,
          macro: calcMacroByQuantity(action.payload)
        }
      ]
    }
    case PRODUCT_TOGGLED: return {
      ...state,
      toggledProductId: state.toggledProductId === action.payload
        ? null
        : action.payload,
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

export interface DiaryMealPayload {
  id: MealId
  name: string
  carbs: number
  prots: number
  fats: number
  kcal: number
  date: string
  updatedAt?: number
  createdAt?: number
}

export interface DiaryMeal extends DiaryMealPayload {
  isToggled: boolean
  day: DateDay
  /** List of meal's product ids */
  products: ProductId[]
}

export interface DiaryProductPayload {
  id: ProductId
  name: string
  producer?: string | null
  img?: string
  barcode: BarcodeId | null
  quantity: number
  unit: ProductUnit
  carbs: number
  prots: number
  fats: number
  kcal: number
  mealId: Meal['id'] | null
  userId?: number | null
  verified: boolean
  updatedAt: Date
  createdAt: Date
}

export interface DiaryProduct extends DiaryProductPayload {
  macro: {
    element: MacroElement
    value: number
  }[]
  isToggled: boolean
}

interface DiaryState {
  meals: DiaryMeal[]
  products: DiaryProduct[]
  toggledProductId: ProductId | null
  isLoading: boolean
}