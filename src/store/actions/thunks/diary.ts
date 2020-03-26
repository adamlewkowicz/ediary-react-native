import { 
  Meal,
  MealProduct,
  IProductRequired,
} from '../../../database/entities';
import {
  mealDeleted,
  mealProductDeleted,
  productQuantityUpdated,
  mealOpenToggled,
  mealProductAdded,
  mealAdded,
  mealsLoaded,
  mealProductAddStarted,
  mealProductAddFinished,
} from '../creators';
import { DayjsDate, ProductId, MealId } from '../../../types';
import { Thunk, StoreState, Selectors } from '../..';
import {
  MealTemplate,
  DiaryMealOrTemplate,
} from '../../reducers/diary';
import { batch } from 'react-redux';
import { ProductResolver } from '../../../screens';
import * as Utils from '../../../utils';

export const mealCreate = (
  name: Meal['name'],
  date: Date,
): Thunk => async (dispatch) => {
  const meal = await Meal.createWithDate({ name }, date);
  
  batch(() => {
    dispatch(mealOpenToggled(null));
    dispatch(mealAdded(meal));
  });
}

export const mealDelete = (
  mealId: MealId
): Thunk => async (dispatch) => {
  dispatch(mealDeleted(mealId));
  await Meal.delete(mealId);
}

export const mealProductCreate = (
  mealId: MealId,
  payload: IProductRequired
): Thunk => async (dispatch, getState) => {
  const newProduct = await Meal.addAndCreateProduct(mealId, payload);
  dispatch(mealProductAdded(mealId, { mealId, ...newProduct }, newProduct));
  await updateMealMacro(mealId, getState());
}

export const mealProductDelete = (
  mealId: MealId,
  productId: ProductId
): Thunk => async (dispatch, getState) => {
  const { meals, templates } = getState().diary;
  const meal = Utils.findOrFail(meals, meal => meal.data.id === mealId);
  const template = templates.find(template => template.name === meal.data.name);
  const isLatestProductOfMeal = meal.productIds.length === 1;
  const isCreatedFromTemplate = template !== undefined;
  
  if (isLatestProductOfMeal && isCreatedFromTemplate) {
    dispatch(mealDeleted(mealId));
    await Meal.delete(mealId);
  } else {
    dispatch(mealProductDeleted(mealId, productId));
    await MealProduct.delete({ mealId, productId });
    await updateMealMacro(mealId, getState());
  }
}

export const mealProductQuantityUpdate = (
  mealId: MealId,
  productId: ProductId,
  quantity: number
): Thunk => (dispatch, getState) => {
  dispatch(productQuantityUpdated(productId, quantity));
  updateProductQuantityDebounced(mealId, productId, quantity, getState());
}

export const mealsFindByDay = (
  dateDay: DayjsDate
): Thunk => async (dispatch) => {
  const foundMeals = await Meal.findByDay(dateDay);
  dispatch(mealsLoaded(foundMeals));
}

export const mealCreateFromTemplate = (
  template: MealTemplate,
  productId: ProductId,
  quantity: number,
  date: Date,
): Thunk<Promise<void>> => async (dispatch, getState) => {
  const createdMeal = await Meal.createFromTemplate(
    template, date, productId, quantity
  );
  dispatch(
    mealAdded(createdMeal)
  );
  await updateMealMacro(createdMeal.id, getState());
}

export const mealProductAdd = (
  mealId: MealId,
  productId: ProductId,
  quantity: number
): Thunk<Promise<void>> => async (dispatch, getState) => {
  const { product, action, rawProduct } = await Meal.addProduct(
    mealId,
    productId,
    quantity
  );
  if (action === 'update') {
    dispatch(
      productQuantityUpdated(productId, product.quantity)
    );
  } else if (action === 'create') {
    dispatch(
      mealProductAdded(mealId, product, rawProduct)
    );
  }
  await updateMealMacro(mealId, getState());
}

export const mealOrTemplateProductAdd = (
  meal: DiaryMealOrTemplate,
  productResolver: ProductResolver,
  quantity: number,
  date: Date,
): Thunk<Promise<void>> => async (dispatch) => {
  const mealId = meal.data.id;

  dispatch(mealProductAddStarted(mealId));

  const product = await productResolver();
  const productId = product.id;

  if (meal.type === 'template') {
    const template: MealTemplate = meal.data;

    await dispatch(
      mealCreateFromTemplate(
        template,
        productId,
        quantity,
        date,
      )
    );
  } else if (meal.type === 'meal') {
    await dispatch(
      mealProductAdd(
        mealId as MealId,
        productId,
        quantity
      )
    );
  }

  dispatch(mealProductAddFinished(mealId));
}

async function updateMealMacro(mealId: MealId, state: StoreState): Promise<void> {
  const meals = Selectors.getMealsCalced(state);
  const foundMeal = meals.find(meal => meal.data.id === mealId);

  if (foundMeal) {
    const { carbs, prots, fats, kcal } = foundMeal.calcedMacro;
    await Meal.update(mealId, { macro: { carbs, prots, fats, kcal }});
  }
}

async function updateProductQuantity(
  mealId: MealId,
  productId: ProductId,
  quantity: number,
  state: StoreState
): Promise<void> {
  await MealProduct.update({ mealId, productId }, { quantity });
  await updateMealMacro(mealId, state);
}

const updateProductQuantityDebounced = Utils.createDebouncedFunc(updateProductQuantity);