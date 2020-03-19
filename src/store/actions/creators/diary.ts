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
import { MealId, ProductId } from '../../../types';
import { Meal, IProductMerged, Product } from '../../../database/entities';
import { DiaryMeal, DiaryProduct, DiaryMealId } from '../../reducers/diary';

export const mealsLoaded = (
  meals: Meal[]
) => ({
  type: MEALS_LOADED,
  payload: meals
});

export const mealAdded = (
  meal: Meal
) => ({
  type: MEAL_ADDED,
  payload: meal,
});

export const mealUpdated = (
  mealId: MealId,
  meal: Partial<DiaryMeal>
) => ({
  type: MEAL_UPDATED,
  payload: meal,
  meta: { mealId }
});

export const mealDeleted = (mealId: MealId) => ({
  type: MEAL_DELETED,
  meta: { mealId }
});

export const mealProductAdded = (
  mealId: MealId,
  product: IProductMerged,
  rawProduct: Product | IProductMerged,
) => ({
  type: MEAL_PRODUCT_ADDED,
  payload: product,
  meta: { mealId, rawProduct }
});

export const mealProductDeleted = (
  mealId: MealId,
  productId: ProductId
) => ({
  type: MEAL_PRODUCT_DELETED,
  meta: { mealId, productId }
});

export const productUpdated = (
  productId: ProductId,
  product: Partial<DiaryProduct>
) => ({
  type: PRODUCT_UPDATED,
  payload: product,
  meta: { productId }
});

export const mealToggled = (
  mealId: DiaryMealId | null
) => ({
  type: MEAL_TOGGLED,
  meta: { mealId }
});

export type MealAdded = ReturnType<typeof mealAdded>;
export type MealProductAdded = ReturnType<typeof mealProductAdded>;

export type DiaryAction =
  | MealAdded
  | MealProductAdded
  | ReturnType<typeof mealsLoaded>
  | ReturnType<typeof mealUpdated>
  | ReturnType<typeof mealDeleted>
  | ReturnType<typeof mealProductDeleted>
  | ReturnType<typeof productUpdated>
  | ReturnType<typeof mealToggled>