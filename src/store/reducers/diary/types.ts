import {
  MealId,
  DateTime,
  ProductId,
  TemplateId,
} from '../../../types';
import { IProduct, IMeal } from '../../../database/entities';

export interface DiaryState {
  meals: DiaryMealOrTemplate[]
  products: DiaryProduct[]
  templates: MealTemplate[]
}

type DiaryMealType = 'meal' | 'template';

interface DiaryMealBase {
  data: IMeal | MealTemplate
  type: DiaryMealType
  productIds: ProductId[]
  isOpened: boolean
  dateTime: DateTime
  dateTimeBase: string
}

export interface DiaryMealTemplate extends DiaryMealBase {
  type: 'template'
  data: MealTemplate
}

export interface DiaryMeal extends DiaryMealBase {
  type: 'meal'
  data: IMeal
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

export type DiaryMealOrTemplateId = MealId | TemplateId;

type DiaryMealOrTemplate = DiaryMeal | DiaryMealTemplate;

export interface MealTemplate {
  id: TemplateId
  name: string
  time: DateTime
}