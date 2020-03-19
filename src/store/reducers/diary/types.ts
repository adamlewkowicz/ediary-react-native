import {
  MealId,
  TemplateIdReverted,
  DateTime,
  ProductId,
  TemplateId,
  DateDay,
} from '../../../types';
import { IProduct } from '../../../database/entities';

export interface DiaryState {
  meals: (DiaryMeal | DiaryMealTemplate)[]
  products: DiaryProduct[]
  templates: DiaryTemplate[]
}

export type DiaryMealId = MealId | TemplateIdReverted;
export type DiaryMealType = 'meal' | 'template';

export interface DiaryMealBase {
  id: DiaryMealId
  name: string
  macro: {
    carbs: number
    prots: number
    fats: number
    kcal: number
  }
  date: string | null
  time: DateTime
  updatedAt?: number
  createdAt?: number
  type: DiaryMealType
  isToggled: boolean
  productIds: ProductId[]
  day: DateDay | null
  dateTimeBase: string
}

export interface DiaryMealTemplate extends DiaryMealBase {
  id: TemplateIdReverted
  date: null
  day: null
  templateId: TemplateId
  type: 'template'
}

export interface DiaryMeal extends DiaryMealBase {
  id: MealId
  date: string
  day: DateDay
  type: 'meal'
}

export interface DiaryProduct {
  data: IProduct
  quantity: number
  mealId: MealId | null
  calcedMacro: {
    carbs: number
    prots: number
    fats: number
    kcal: number
  }
}

export interface DiaryTemplate {
  id: TemplateId
  name: string
  time: DateTime
}

export type NormalizeMealsResult = {
  meals: DiaryMeal[]
  products: DiaryProduct[]
}

export type NormalizeMealResult = {
  meal: DiaryMeal
  products: DiaryProduct[]
}