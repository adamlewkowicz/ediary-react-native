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
  DateTime,
} from '../../types';
import { Meal, IProduct } from '../../database/entities';
import { DiaryActions } from '../actions';
import { calcMacroByQuantity, getDataFromTemplate } from '../helpers/diary';
import { getDayFromDate, getTimeFromDate } from '../../common/utils';

const initialState: DiaryState = {
  meals: [
    {
      id: -1,
      name: 'Śniadanie',
      carbs: 0,
      prots: 0,
      fats: 0,
      kcal: 0,
      date: null as any,
      day: '' as any,
      time: '' as any,
      isTemplate: true,
      isToggled: false,
      productIds: [],
      createdAt: 1,
      updatedAt: 1,
    }
  ],
  templates: [
    {
      name: 'Śniadanie',
      time: '08:30:00' as any as DateTime,
    },
    {
      name: 'Obiad',
      time: '12:00:00' as any as DateTime,
    }
  ],
  products: [],
  recentProducts: [],
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
          isTemplate: false,
          day: getDayFromDate(meal.date),
          time: getTimeFromDate(meal.date),
          productIds: mealProducts.map(mealProduct => mealProduct.productId),
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
          isTemplate: false,
          productIds: [],
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
    case MEAL_DELETED: 
      const mealToDelete = state.meals.find(meal => meal.id === action.meta.mealId);
      const filteredMeals = state.meals.filter(meal => meal.id !== action.meta.mealId);

      if (mealToDelete && mealToDelete.template) {
        return {
          ...state,
          meals: [
            ...filteredMeals,
            {
              id: -1,
              name: mealToDelete.template.name,
              carbs: 0,
              prots: 0,
              fats: 0,
              kcal: 0,
              date: null as any,
              day: '' as any,
              isTemplate: true,
              isToggled: false,
              productIds: [],
              createdAt: 1,
              updatedAt: 1,
            }
          ]
        }
      }
      return {
        ...state,
        meals: state.meals.filter(meal => meal.id !== action.meta.mealId),
        products: state.products.filter(product => product.mealId !== action.meta.mealId)
      }
    case MEAL_PRODUCT_ADDED: return {
      ...state,
      meals: state.meals.map(meal => meal.id === action.meta.mealId 
        ? { ...meal, productIds: [...meal.productIds, action.payload.id] }
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
          const productIds = meal.productIds.filter(productId =>
            productId !== action.meta.productId
          );
          return {
            ...meal,
            productIds
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
      recentProducts: [action.payload, ...state.recentProducts].splice(0, 4)
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
  isTemplate: boolean
  day: DateDay
  time: DateTime
  productIds: ProductId[]
  template?: MealTemplate
}

interface DiaryMealLayout {

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
  recentProducts: IProduct[]
  toggledProductId: ProductId | null
  templates: MealTemplate[]
  isLoading: boolean
}

interface MealTemplate {
  name: string
  time: DateTime
}