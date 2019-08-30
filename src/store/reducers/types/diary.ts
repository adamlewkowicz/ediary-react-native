import {
  MealId,
  TemplateIdReverted,
  DateTime,
  ProductId,
  TemplateId,
  DateDay,
  BarcodeId,
  ProductUnit,
  MacroElement,
} from '../../../types';
import { IProduct } from '../../../database/entities';

export type DiaryMealId = MealId | TemplateIdReverted;

export interface DiaryMealBase {
  id: DiaryMealId
  name: string
  carbs: number
  prots: number
  fats: number
  kcal: number
  date: string | null
  time: DateTime
  updatedAt?: number
  createdAt?: number
  //
  type: 'meal' | 'template'
  isToggled: boolean
  productIds: ProductId[]
  templateId: TemplateId | null
  day: DateDay | null
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
  mealId: MealId | null
  userId?: number | null
  verified: boolean
  updatedAt: Date
  createdAt: Date
  //
  macro: {
    element: MacroElement
    value: number
  }[]
  isToggled: boolean
}

export interface DiaryTemplate {
  id: TemplateId
  name: string
  time: DateTime
}

export interface DiaryState {
  meals: (DiaryMeal | DiaryMealTemplate)[]
  products: DiaryProduct[]
  recentProducts: IProduct[]
  toggledProductId: ProductId | null
  templates: DiaryTemplate[]
}