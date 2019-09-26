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
  MacroElements,
} from '../../../types';

export interface DiaryState {
  meals: (DiaryMeal | DiaryMealTemplate)[]
  products: DiaryProduct[]
  templates: MealTemplate[]
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
  //
  type: DiaryMealType
  isToggled: boolean
  productIds: ProductId[]
  /** @deprecated - Remove `templateId` and rely on meal's name instead of template id */
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
  mealId: MealId | null
  userId?: number | null
  isVerified: boolean | null
  updatedAt: Date
  createdAt: Date
  macro: {
    carbs: number
    prots: number
    fats: number
    kcal: number
  }
  //
  calcedMacro: {
    element: MacroElement
    value: number
  }[]
  isToggled: boolean
}

export interface MealTemplate {
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

export interface CalcMacroByQuantityData extends MacroElements {}