import { Meal, Product } from '../../entities';
import { ProductState } from '../reducers/diary';
import {
  MEAL_CREATED,
  MEAL_UPDATED,
  MEAL_DELETED,
  MEAL_PRODUCT_CREATED,
  MEAL_PRODUCT_DELETED,
  PRODUCT_UPDATED
} from '../consts';
import {
  MealDeleted,
  MealUpdated,
  MealCreated,
  MealProductCreated,
  MealProductDeleted,
  ProductUpdated
} from '../action-types/diary';

export const mealCreated = (meal: Meal): MealCreated => ({
  type: MEAL_CREATED,
  payload: meal
});

export const mealUpdated = (mealId: Meal['id'], meal: Meal): MealUpdated => ({
  type: MEAL_UPDATED,
  payload: meal,
  meta: { mealId }
});

export const mealDeleted = (mealId: Meal['id']): MealDeleted => ({
  type: MEAL_DELETED,
  meta: { mealId }
});

export const mealProductCreated = (
  mealId: Meal['id'],
  product: ProductState
): MealProductCreated => ({
  type: MEAL_PRODUCT_CREATED,
  payload: product,
  meta: { mealId }
});

export const mealProductDeleted = (
  mealId: Meal['id'],
  productId: Product['id']
): MealProductDeleted => ({
  type: MEAL_PRODUCT_DELETED,
  meta: { mealId, productId }
});

export const productUpdated = (
  productId: Product['id'],
  product: Product
): ProductUpdated => ({
  type: PRODUCT_UPDATED,
  payload: product,
  meta: { productId }
});