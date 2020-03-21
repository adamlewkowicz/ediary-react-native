import {
  MEAL_DELETED,
  MEAL_PRODUCT_DELETED,
  PRODUCT_QUANTITY_UPDATED,
  MEAL_OPEN_TOGGLED,
  MEAL_PRODUCT_ADDED,
  MEAL_ADDED,
  MEALS_LOADED,
  MEAL_PRODUCT_ADD_STARTED,
  MEAL_PRODUCT_ADD_FINISHED,
} from '../../consts';
import { MealId, ProductId } from '../../../types';
import { Meal, IProductMerged, IProduct } from '../../../database/entities';
import { DiaryMealOrTemplateId } from '../../reducers/diary';

export const mealsLoaded = (meals: Meal[]) => ({
  type: MEALS_LOADED,
  payload: meals
});

export const mealProductAddStarted = (mealId: DiaryMealOrTemplateId) => ({
  type: MEAL_PRODUCT_ADD_STARTED,
  meta: { mealId }
});

export const mealProductAddFinished = (mealId: DiaryMealOrTemplateId) => ({
  type: MEAL_PRODUCT_ADD_FINISHED,
  meta: { mealId }
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
  | ReturnType<typeof mealProductAddStarted>
  | ReturnType<typeof mealProductAddFinished>