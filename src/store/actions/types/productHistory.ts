import { PRODUCTS_RECENT_LOADED } from '../../consts'
import { Product } from '../../../database/entities'
import { MealProductAdded } from './diary'

export type ProductsRecentLoaded = {
  type: typeof PRODUCTS_RECENT_LOADED
  payload: Product[]
}

export type ProductHistoryAction = 
  | MealProductAdded
  | ProductsRecentLoaded