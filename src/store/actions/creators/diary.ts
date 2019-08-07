import { DiaryMealPayload, DiaryProductPayload } from '../../reducers/diary';
import {
  MEAL_CREATED,
  MEAL_UPDATED,
  MEAL_DELETED,
  MEAL_PRODUCT_CREATED,
  MEAL_PRODUCT_DELETED,
  PRODUCT_UPDATED,
  MEAL_TOGGLED,
  PRODUCT_CREATED,
  MEALS_ADDED,
  PRODUCT_TOGGLED
} from '../../consts';
import {
  MealDeleted,
  MealUpdated,
  MealCreated,
  MealProductCreated,
  MealProductDeleted,
  ProductUpdated,
  MealToggled,
  ProductCreated,
  MealsAdded,
  ProductToggled
} from '../types';
import { MealId, ProductId } from '../../../types';
import { Meal } from '../../../entities';

export const mealCreated = (
  meal: DiaryMealPayload
): MealCreated => ({
  type: MEAL_CREATED,
  payload: meal
});

export const mealUpdated = (
  mealId: MealId,
  meal: Partial<DiaryMealPayload>
): MealUpdated => ({
  type: MEAL_UPDATED,
  payload: meal,
  meta: { mealId }
});

export const mealDeleted = (mealId: MealId): MealDeleted => ({
  type: MEAL_DELETED,
  meta: { mealId }
});

// Rename to mealProductAdded
export const mealProductCreated = (
  mealId: MealId,
  product: DiaryProductPayload
): MealProductCreated => ({
  type: MEAL_PRODUCT_CREATED,
  payload: product,
  meta: { mealId }
});

export const mealProductDeleted = (
  mealId: MealId,
  productId: ProductId
): MealProductDeleted => ({
  type: MEAL_PRODUCT_DELETED,
  meta: { mealId, productId }
});

export const productUpdated = (
  productId: ProductId,
  product: Partial<DiaryProductPayload>
): ProductUpdated => ({
  type: PRODUCT_UPDATED,
  payload: product,
  meta: { productId }
});

export const mealToggled = (
  mealId: MealId | null
): MealToggled => ({
  type: MEAL_TOGGLED,
  meta: { mealId }
});

export const productCreated = (
  product: DiaryProductPayload
): ProductCreated => ({
  type: PRODUCT_CREATED,
  payload: product
});

export const mealsAdded = (
  meals: Meal[]
): MealsAdded => ({
  type: MEALS_ADDED,
  payload: meals
});

export const productToggled = (
  productId: ProductId | null
): ProductToggled => ({
  type: PRODUCT_TOGGLED,
  payload: productId
});