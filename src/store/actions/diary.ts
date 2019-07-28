import { mealRepository, productRepository, mealProductRepository } from '../../repositories';
import { Meal, Product, MealProduct } from '../../entities';
import {
  MEAL_CREATED,
  MEAL_UPDATED,
  MEAL_DELETED,
  MEAL_PRODUCT_CREATED,
  MEAL_PRODUCT_DELETED,
  PRODUCT_UPDATED
} from '../consts';
import { ProductState } from '../reducers/diary';

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

export const mealCreate = (name: Meal['name']) => async (dispatch: any) => {
  const meal = await mealRepository().save({ name });
  dispatch(mealCreated(meal));
}

export const mealDelete = (mealId: Meal['id']) => async (dispatch: any) => {
  dispatch(mealDeleted(mealId));
  await mealRepository().delete(mealId);
}

export const mealUpdate = (mealId: Meal['id'], meal: Meal) => async (dispatch: any) => {
  dispatch(mealUpdated(mealId, meal));
  await mealRepository().update(mealId, meal);
}

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

export const mealProductCreate = (
  mealId: Meal['id'],
  payload: Product
) => async (dispatch: any) => {
  const meal = await mealRepository().findOne(mealId) as Meal;
  const newProduct = await meal.addAndCreateProduct(payload);
  dispatch(mealProductCreated(mealId, newProduct));
}

export const mealProductDelete = (
  mealId: Meal['id'],
  productId: Product['id']
) => async (dispatch: any) => {
  dispatch(mealProductDeleted(mealId, productId));
  await mealProductRepository().delete({ mealId, productId });
}

export const productUpdate = (
  productId: Product['id'],
  product: Product
) => async (dispatch: any) => {
  dispatch(productUpdated(productId, product));
  await productRepository().update(productId, product);
}

type MealCreated = {
  type: typeof MEAL_CREATED
  payload: Meal
}

type MealUpdated = {
  type: typeof MEAL_UPDATED
  payload: Partial<Meal>
  meta: { mealId: Meal['id'] }
}

type MealDeleted = {
  type: typeof MEAL_DELETED
  meta: { mealId: Meal['id'] }
}

type MealProductCreated = {
  type: typeof MEAL_PRODUCT_CREATED
  payload: ProductState
  meta: { mealId: Meal['id'] }
}

type MealProductDeleted = {
  type: typeof MEAL_PRODUCT_DELETED
  meta: {
    mealId: Meal['id']
    productId: Product['id']
  }
}

type ProductUpdated = {
  type: typeof PRODUCT_UPDATED
  payload: Partial<Product>
  meta: {
    productId: Product['id']
  }
}

export type DiaryActions =
  | MealCreated 
  | MealUpdated 
  | MealDeleted 
  | MealProductCreated
  | MealProductDeleted
  | ProductUpdated;