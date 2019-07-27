import { PRODUCT_UNITS } from './common/consts';

export interface Meal {
  id: number
  name: string
  carbs: number
  prots: number
  fats: number
  kcal: number
  updatedAt: number
  createdAt: number
}

export interface Product {
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
  mealId: Meal['id']
  userId?: number
  updatedAt: Date
  createdAt: Date
}

export type ProductUnit = typeof PRODUCT_UNITS[number];