import { PRODUCT_UNITS, MACRO_ELEMENTS } from './common/consts';

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

export interface ProductMerged extends Product {};

export type ProductUnit = typeof PRODUCT_UNITS[number];

export type ArrayElement<ArrayType extends readonly unknown[]> = ArrayType[number];

export type MacroElement = typeof MACRO_ELEMENTS[number];

export type MacroElements = {
  [key in MacroElement]: number
}