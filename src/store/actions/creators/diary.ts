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
import { DiaryActions } from '../types';
import { MealId, ProductId } from '../../../types';
import { Meal, IProductMerged, Product } from '../../../database/entities';
import { DiaryMeal, DiaryProduct, DiaryMealId } from '../../reducers/diary';

export const mealsLoaded = (
  meals: Meal[]
): DiaryActions => ({
  type: MEALS_LOADED,
  payload: meals
});

export const mealAdded = (
  meal: Meal
): DiaryActions => ({
  type: MEAL_ADDED,
  payload: meal,
});

export const mealUpdated = (
  mealId: MealId,
  meal: Partial<DiaryMeal>
): DiaryActions => ({
  type: MEAL_UPDATED,
  payload: meal,
  meta: { mealId }
});

export const mealDeleted = (mealId: MealId): DiaryActions => ({
  type: MEAL_DELETED,
  meta: { mealId }
});

export const mealProductAdded = (
  mealId: MealId,
  product: IProductMerged,
  rawProduct?: Product,
): DiaryActions => ({
  type: MEAL_PRODUCT_ADDED,
  payload: product,
  meta: { mealId, rawProduct }
});

export const mealProductDeleted = (
  mealId: MealId,
  productId: ProductId
): DiaryActions => ({
  type: MEAL_PRODUCT_DELETED,
  meta: { mealId, productId }
});

export const productUpdated = (
  productId: ProductId,
  product: Partial<DiaryProduct>
): DiaryActions => ({
  type: PRODUCT_UPDATED,
  payload: product,
  meta: { productId }
});

export const mealToggled = (
  mealId: DiaryMealId | null
): DiaryActions => ({
  type: MEAL_TOGGLED,
  meta: { mealId }
});

export const productToggled = (
  productId: ProductId | null
): DiaryActions => ({
  type: PRODUCT_TOGGLED,
  payload: productId
});