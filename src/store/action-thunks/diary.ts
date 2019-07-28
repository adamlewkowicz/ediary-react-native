import { Meal, Product } from '../../entities';
import {
  mealCreated,
  mealDeleted,
  mealUpdated,
  mealProductCreated,
  mealProductDeleted,
  productUpdated
} from '../actions/index';
import {
  mealRepository,
  mealProductRepository, 
  productRepository
} from '../../repositories';


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