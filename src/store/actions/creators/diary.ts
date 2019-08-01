import { Meal, Product } from '../../../entities';
import { ProductState, MealState } from '../../reducers/diary';
import {
  MEAL_CREATED,
  MEAL_UPDATED,
  MEAL_DELETED,
  MEAL_PRODUCT_CREATED,
  MEAL_PRODUCT_DELETED,
  PRODUCT_UPDATED,
  MEAL_TOGGLED,
  PRODUCT_CREATED
} from '../../consts';
import {
  MealDeleted,
  MealUpdated,
  MealCreated,
  MealProductCreated,
  MealProductDeleted,
  ProductUpdated,
  MealToggled,
  ProductCreated
} from '../types';

export const mealCreated = (meal: Meal): MealCreated => ({
  type: MEAL_CREATED,
  payload: meal
});

export const mealUpdated = (
  mealId: Meal['id'],
  meal: Partial<MealState>
): MealUpdated => ({
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
  product: Partial<ProductState>
): ProductUpdated => ({
  type: PRODUCT_UPDATED,
  payload: product,
  meta: { productId }
});

export const mealToggled = (
  mealId: MealState['id'] | null
): MealToggled => ({
  type: MEAL_TOGGLED,
  meta: { mealId }
});

export const productCreated = (
  product: ProductState
): ProductCreated => ({
  type: PRODUCT_CREATED,
  payload: product
});