import { mealsRepository } from '../../repositories';
import { Meal, Product } from '../../entities';
import {
  MEAL_CREATED,
  MEAL_UPDATED,
  MEAL_DELETED
} from '../consts';

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
  const meal = await mealsRepository.save({ name });
  dispatch(mealCreated(meal));
}

export const mealDelete = (mealId: Meal['id']) => async (dispatch: any) => {
  dispatch(mealDeleted(mealId));
  await mealsRepository.delete(mealId);
}

export const mealUpdate = (mealId: Meal['id'], meal: Meal) => async (dispatch: any) => {
  dispatch(mealUpdated(mealId, meal));
  await mealsRepository.update(mealId, meal);
}

export const mealProductCreate = (product: Product) => async (dispatch: any) => {
  dispatch()
}


type MealCreated = {
  type: typeof MEAL_CREATED
  payload: Meal
}

type MealUpdated = {
  type: typeof MEAL_UPDATED
  payload: Meal
  meta: { mealId: Meal['id'] }
}

type MealDeleted = {
  type: typeof MEAL_DELETED
  meta: { mealId: Meal['id'] }
}

export type DiaryActions = MealCreated | MealUpdated | MealDeleted