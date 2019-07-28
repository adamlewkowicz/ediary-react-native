import {
  MEAL_CREATED,
  MEAL_UPDATED,
  MEAL_DELETED,
  MEAL_PRODUCT_CREATED,
  MEAL_PRODUCT_DELETED,
  PRODUCT_UPDATED,
  MEAL_TOGGLED,
} from '../../consts';
import { Meal, Product } from '../../../entities';
import { ProductState, MealState } from '../../reducers/diary';

export type MealCreated = {
  type: typeof MEAL_CREATED
  payload: Meal
}

export type MealUpdated = {
  type: typeof MEAL_UPDATED
  payload: Partial<Meal>
  meta: { mealId: Meal['id'] }
}

export type MealDeleted = {
  type: typeof MEAL_DELETED
  meta: { mealId: Meal['id'] }
}

export type MealProductCreated = {
  type: typeof MEAL_PRODUCT_CREATED
  payload: ProductState
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
  payload: Partial<ProductState>
  meta: {
    productId: Product['id']
  }
}

export type MealToggled = {
  type: typeof MEAL_TOGGLED
  meta: {
    mealId: MealState['id']
  }
}

export type DiaryActions =
  | MealCreated 
  | MealUpdated 
  | MealDeleted 
  | MealProductCreated
  | MealProductDeleted
  | ProductUpdated
  | MealToggled