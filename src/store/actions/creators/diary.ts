import {
  DiaryMealPayload,
  DiaryProductPayload,
} from '../../reducers/diary';
import {
  MEAL_CREATED,
  MEAL_UPDATED,
  MEAL_DELETED,
  MEAL_PRODUCT_DELETED,
  PRODUCT_UPDATED,
  MEAL_TOGGLED,
  PRODUCT_CREATED,
  MEALS_ADDED,
  PRODUCT_TOGGLED,
  MEAL_PRODUCT_ADDED,
  MEAL_TEMPLATE_TOGGLED
} from '../../consts';
import {
  MealDeleted,
  MealUpdated,
  MealCreated,
  MealProductDeleted,
  ProductUpdated,
  ProductCreated,
  MealsAdded,
  ProductToggled,
  MealProductAdded,
  DiaryActions
} from '../types';
import { MealId, ProductId, TemplateId } from '../../../types';
import { Meal, IProduct } from '../../../database/entities';

export const mealCreated = (
  meal: Meal
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

export const mealProductAdded = (
  mealId: MealId,
  product: DiaryProductPayload
): MealProductAdded => ({
  type: MEAL_PRODUCT_ADDED,
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
): DiaryActions => ({
  type: MEAL_TOGGLED,
  meta: { targetId: mealId }
});

export const productCreated = (
  product: IProduct
): ProductCreated => ({
  type: PRODUCT_CREATED,
  payload: product
});

export const mealsAdded = (
  meals: Meal[],
  templateId?: TemplateId
): MealsAdded => ({
  type: MEALS_ADDED,
  payload: meals,
  meta: { templateId }
});

export const productToggled = (
  productId: ProductId | null
): ProductToggled => ({
  type: PRODUCT_TOGGLED,
  payload: productId
});

export const mealTemplateToggled = (
  templateId: TemplateId | null
): DiaryActions => ({
  type: MEAL_TEMPLATE_TOGGLED,
  meta: { targetId: templateId }
});