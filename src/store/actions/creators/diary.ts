import {
  MEAL_UPDATED,
  MEAL_DELETED,
  MEAL_PRODUCT_DELETED,
  PRODUCT_UPDATED,
  MEAL_TOGGLED,
  PRODUCT_CREATED,
  PRODUCT_TOGGLED,
  MEAL_PRODUCT_ADDED,
  MEAL_ADDED,
  MEALS_LOADED,
} from '../../consts';
import { DiaryActions } from '../types';
import { MealId, ProductId, TemplateId } from '../../../types';
import { Meal, IProduct, IProductMerged } from '../../../database/entities';
import { DiaryMeal, DiaryProduct, DiaryMealId } from '../../reducers/diary';

export const mealsLoaded = (
  meals: Meal[]
): DiaryActions => ({
  type: MEALS_LOADED,
  payload: meals
});

export const mealAdded = (
  meal: Meal,
  templateId: TemplateId | null
): DiaryActions => ({
  type: MEAL_ADDED,
  payload: meal,
  meta: { templateId }
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
  product: IProductMerged
): DiaryActions => ({
  type: MEAL_PRODUCT_ADDED,
  payload: product,
  meta: { mealId }
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

export const productCreated = (
  product: IProduct
): DiaryActions => ({
  type: PRODUCT_CREATED,
  payload: product
});

export const productToggled = (
  productId: ProductId | null
): DiaryActions => ({
  type: PRODUCT_TOGGLED,
  payload: productId
});