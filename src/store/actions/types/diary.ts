import {
  MEAL_UPDATED,
  MEAL_DELETED,
  MEAL_PRODUCT_DELETED,
  PRODUCT_UPDATED,
  MEAL_TOGGLED,
  PRODUCT_TOGGLED,
  MEAL_PRODUCT_ADDED,
  MEAL_ADDED,
  MEALS_LOADED,
} from '../../consts';
import { Meal, IProductMerged, Product } from '../../../database/entities';
import { ProductId, TemplateId, MealId } from '../../../types';
import { DiaryMeal, DiaryProduct, DiaryMealId } from '../../reducers/diary';

export type MealUpdated = {
  type: typeof MEAL_UPDATED
  payload: Partial<DiaryMeal>
  meta: { mealId: MealId }
}

export type MealDeleted = {
  type: typeof MEAL_DELETED
  meta: { mealId: MealId }
}

export type MealProductAdded = {
  type: typeof MEAL_PRODUCT_ADDED
  payload: IProductMerged
  meta: {
    mealId: MealId
    rawProduct?: Product
  }
}

export type MealProductDeleted = {
  type: typeof MEAL_PRODUCT_DELETED
  meta: {
    mealId: MealId
    productId: ProductId
  }
}

export type ProductUpdated = {
  type: typeof PRODUCT_UPDATED
  payload: Partial<DiaryProduct>
  meta: {
    productId: ProductId
  }
}

export type MealToggled = {
  type: typeof MEAL_TOGGLED
  meta: {
    mealId: DiaryMealId | null
  }
}

export type MealsLoaded = {
  type: typeof MEALS_LOADED
  payload: Meal[]
}

export type ProductToggled = {
  type: typeof PRODUCT_TOGGLED
  payload: ProductId | null
}

export type MealAdded = {
  type: typeof MEAL_ADDED
  payload: Meal
  meta: {
    templateId: TemplateId | null
  }
}

export type DiaryActions =
  | MealUpdated 
  | MealDeleted 
  | MealProductAdded
  | MealProductDeleted
  | ProductUpdated
  | MealToggled
  | MealsLoaded
  | ProductToggled
  | MealAdded