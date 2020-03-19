import {
  MealId,
  DateTime,
  ProductId,
  TemplateId,
} from '../../../types';
import { IProduct, IMeal } from '../../../database/entities';

export interface DiaryState {
  meals: (DiaryMeal | DiaryMealTemplate)[]
  products: DiaryProduct[]
  templates: DiaryTemplate[]
}

export type DiaryMealId = MealId | TemplateId;
type DiaryMealType = 'meal' | 'template';

export interface DiaryMealBase {
  data: IMeal | DiaryTemplate
  type: DiaryMealType
  productIds: ProductId[]
  isOpened: boolean
  dateTime: DateTime
  dateTimeBase: string
}

export interface DiaryMealTemplate extends DiaryMealBase {
  type: 'template'
  data: DiaryTemplate
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

export interface DiaryTemplate {
  id: TemplateId
  name: string
  time: DateTime
}