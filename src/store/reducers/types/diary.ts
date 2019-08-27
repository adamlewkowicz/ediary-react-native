import {
  MealId,
  TemplateIdReverted,
  DateTime,
  ProductId,
  TemplateId,
  DateDay,
} from '../../../types';

interface DiaryMealBase {
  id: MealId | TemplateIdReverted
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
  isToggled: boolean
  isTemplate: boolean
  productIds: ProductId[]
  templateId: TemplateId | null
  day: DateDay | null
}

export interface DiaryMealTemplate extends DiaryMealBase {
  id: TemplateIdReverted
  date: null
  day: null
  productIds: []
  isTemplate: true
  templateId: TemplateId
}

export interface DiaryMeal_ extends DiaryMealBase {
  id: MealId
  date: string
  day: DateDay
  isTemplate: false
}