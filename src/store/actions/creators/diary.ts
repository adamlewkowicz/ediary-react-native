import {
  MEAL_DELETED,
  MEAL_PRODUCT_DELETED,
  PRODUCT_QUANTITY_UPDATED,
  MEAL_OPEN_TOGGLED,
  MEAL_PRODUCT_ADDED,
  MEAL_ADDED,
  MEALS_LOADED,
} from '../../consts';
import { MealId, ProductId } from '../../../types';
import { Meal, IProductMerged, IProduct } from '../../../database/entities';
import { DiaryMealOrTemplateId } from '../../reducers/diary';

export const mealsLoaded = (
  meals: Meal[],
  shouldOpenMealsByDefault = false,
) => ({
  type: MEALS_LOADED,
  payload: meals,
  meta: { shouldOpenMealsByDefault }
});

export const mealAdded = (
  meal: Meal
) => ({
  type: MEAL_ADDED,
  payload: meal,
});

export const mealDeleted = (mealId: MealId) => ({
  type: MEAL_DELETED,
  meta: { mealId }
});

export const mealProductAdded = (
  mealId: MealId,
  product: IProductMerged,
  rawProduct: IProduct,
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

export const productQuantityUpdated = (
  productId: ProductId,
  quantity: number
) => ({
  type: PRODUCT_QUANTITY_UPDATED,
  payload: quantity,
  meta: { productId }
});

export const mealOpenToggled = (
  mealId: DiaryMealOrTemplateId | null
) => ({
  type: MEAL_OPEN_TOGGLED,
  meta: { mealId }
});

export type MealAdded = ReturnType<typeof mealAdded>;
export type MealProductAdded = ReturnType<typeof mealProductAdded>;

export type DiaryAction =
  | MealAdded
  | MealProductAdded
  | ReturnType<typeof mealsLoaded>
  | ReturnType<typeof mealDeleted>
  | ReturnType<typeof mealProductDeleted>
  | ReturnType<typeof productQuantityUpdated>
  | ReturnType<typeof mealOpenToggled>