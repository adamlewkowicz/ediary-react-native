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
  MEAL_TEMPLATE_TOGGLED,
  MEAL_ADDED_FROM_TEMPLATE,
  MEAL_ADDED,
} from '../consts';
import {
  ProductUnit,
  MacroElement,
  BarcodeId,
  ProductId,
  MealId,
  DateDay,
  DateTime,
  TemplateId,
  TemplateIdReverted,
} from '../../types';
import { Meal, IProduct } from '../../database/entities';
import { DiaryActions } from '../actions';
import { calcMacroByQuantity, normalizeMeals, getRevertedTemplateId, normalizeMeal } from '../helpers/diary';
import { getDayFromDate, getTimeFromDate } from '../../common/utils';
import { DiaryMeal_, DiaryMealTemplate } from './types/diary';

const initialState: DiaryState = {
  meals: [],
  products: [],
  templates: [
    {
      id: 1 as any as TemplateId,
      name: 'Śniadanie',
      time: '08:30:00' as any as DateTime,
      isToggled: true,
    },
    {
      id: 2 as any as TemplateId,
      name: 'Obiad',
      time: '12:00:00' as any as DateTime,
      isToggled: false
    }
  ],
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
      ...normalizeMeals(
        action.payload,
        action.meta.templateId
      )
    }
    case MEAL_CREATED: return {
      ...state,
      // meals: [
      //   ...state.meals,
      //   {
      //     ...action.payload,
      //     day: getDayFromDate(action.payload.date),
      //     time: getTimeFromDate(action.payload.date),
      //     isToggled: true,
      //     templateId: null,
      //     productIds: [],
      //   }
      // ],
      meals: state.templates.map(template => ({
        ...template,
        id: template.id as any,
        carbs: 0,
        prots: 0,
        fats: 0,
        kcal: 0,
        day: null,
        date: null,
        templateId: template.id,
        isTemplate: true,
        isToggled: false,
        productIds: [],
      }))
    }
    case MEAL_ADDED: {
      const { templateId } = action.meta;
      const { meal, products } = normalizeMeal(action.payload, templateId);

      if (templateId) {
        return {
          ...state,
          products: [...state.products, ...products],
          meals: state.meals.map(meal => {
            if (meal.isTemplate && meal.templateId === templateId) {
              return {
                ...action.payload,
                day: getDayFromDate(action.payload.date),
                time: getTimeFromDate(action.payload.date),
                productIds: products.map(product => product.id),
                isToggled: true,
                isTemplate: false,
                templateId: templateId || null,
              }
            }
            return meal;
          })
        }
      }
      return {
        ...state,
        products: [...state.products, ...products],
        meals: [...state.meals, { ...meal, isTemplate: false }]
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
            return [
              {
                id: getRevertedTemplateId(meal.templateId),
                carbs: 0,
                prots: 0,
                fats: 0,
                kcal: 0,
                day: null,
                date: null,
                isTemplate: true,
                isToggled: false,
                productIds: [],
                templateId,
                name,
                time,
              }
            ]
          }
          return [];
        }
        return [meal];
      })
    }
    case MEAL_TOGGLED: return {
      ...state,
      toggledProductId: null,
      meals: state.meals.map(meal => ({
        ...meal,
        isToggled: action.meta.targetId === meal.id
          ? !meal.isToggled
          : false
      }))
    }
    case MEAL_TEMPLATE_TOGGLED: return {
      ...state,
      templates: state.templates.map(template => ({
        ...template,
        isToggled: action.meta.targetId === template.id
          ? !template.isToggled
          : false
      }))
    }
    case MEAL_UPDATED: return {
      ...state,
      meals: state.meals.map(meal =>
        !meal.isTemplate && meal.id === action.meta.mealId
          ? { ...meal, ...action.payload }
          : meal
      )
    }
    case MEAL_PRODUCT_ADDED: return {
      ...state,
      meals: state.meals.map(meal => 
        !meal.isTemplate && meal.id === action.meta.mealId 
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
        if (!meal.isTemplate && meal.id === action.meta.mealId) {
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
  id: MealId | TemplateIdReverted
  name: string
  carbs: number
  prots: number
  fats: number
  kcal: number
  date: string | null
  updatedAt?: number
  createdAt?: number
}

export interface DiaryMeal extends DiaryMealPayload {
  isToggled: boolean
  day: DateDay | null
  time: DateTime
  productIds: ProductId[]
  templateId: TemplateId | null
  isTemplate: boolean
}

export interface Template {
  id: TemplateId
  name: string
  time: DateTime
  isToggled: boolean
}
export { Template as DiaryTemplate }

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
  meals: (DiaryMeal_ | DiaryMealTemplate)[]
  products: DiaryProduct[]
  recentProducts: IProduct[]
  toggledProductId: ProductId | null
  templates: Template[]
  isLoading: boolean
}

export type MealType = 'meal' | 'template';