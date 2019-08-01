import {
  MEAL_CREATED,
  MEAL_UPDATED,
  MEAL_DELETED,
  MEAL_PRODUCT_CREATED,
  MEAL_PRODUCT_DELETED,
  PRODUCT_UPDATED,
  MEAL_TOGGLED,
  PRODUCT_CREATED,
} from '../../consts';
import { Meal, Product } from '../../../entities';
import {
  DiaryMealPayload,
  DiaryProductPayload,
} from '../../reducers/diary';

export type MealCreated = {
  type: typeof MEAL_CREATED
  payload: DiaryMealPayload
}

export type MealUpdated = {
  type: typeof MEAL_UPDATED
  payload: Partial<DiaryMealPayload>
  meta: { mealId: Meal['id'] }
}

export type MealDeleted = {
  type: typeof MEAL_DELETED
  meta: { mealId: Meal['id'] }
}

export type MealProductCreated = {
  type: typeof MEAL_PRODUCT_CREATED
  payload: DiaryProductPayload
  meta: { mealId: Meal['id'] }
}

export type MealProductDeleted = {
  type: typeof MEAL_PRODUCT_DELETED
  meta: {
    mealId: Meal['id']
    productId: Product['id']
  }
}

export type ProductUpdated = {
  type: typeof PRODUCT_UPDATED
  payload: Partial<DiaryProductPayload>
  meta: {
    productId: Product['id']
  }
}

export type MealToggled = {
  type: typeof MEAL_TOGGLED
  meta: {
    mealId: Meal['id'] | null
  }
}

export type ProductCreated = {
  type: typeof PRODUCT_CREATED
  payload: DiaryProductPayload
}

export type DiaryActions =
  | MealCreated 
  | MealUpdated 
  | MealDeleted 
  | MealProductCreated
  | MealProductDeleted
  | ProductUpdated
  | MealToggled
  | ProductCreated