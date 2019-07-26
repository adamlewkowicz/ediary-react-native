
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
  barcode: string | null
  carbs: number
  prots: number
  fats: number
  kcal: number
  updatedAt: number
  createdAt: number
}