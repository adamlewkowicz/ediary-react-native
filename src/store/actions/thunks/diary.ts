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
import { DateDay, ProductId, MealId } from '../../../types';
import { Thunk, StoreState, Selectors } from '../..';
import {
  MealTemplate,
  DiaryMealOrTemplate,
} from '../../reducers/diary';
import { batch } from 'react-redux';
import { ProductResolver } from '../../../screens';
import { utils } from '../../../utils';

const debounceA = utils.debounce();

async function _updateMealMacro(mealId: MealId, store: StoreState) {
  const meals = Selectors.getMealsCalced(store);
  const foundMeal = meals.find(meal => meal.data.id === mealId);
  if (foundMeal) {
    const { carbs, prots, fats, kcal } = foundMeal;
    await Meal.update(mealId, { macro: { carbs, prots, fats, kcal }});
  }
}

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
  await _updateMealMacro(mealId, getState());
}

export const mealProductDelete = (
  mealId: MealId,
  productId: ProductId
): Thunk => async (dispatch, getState) => {
  const { meals, templates } = getState().diary;
  const meal = findOrFail(meals, meal => meal.data.id === mealId);
  const template = templates.find(template => template.name === meal.data.name);
  const isLatestProductOfMeal = meal.productIds.length === 1;
  const isCreatedFromTemplate = template !== undefined;
  
  if (isLatestProductOfMeal && isCreatedFromTemplate) {
    dispatch(mealDeleted(mealId));
    await Meal.delete(mealId);
  } else {
    dispatch(mealProductDeleted(mealId, productId));
    await MealProduct.delete({ mealId, productId });
    await _updateMealMacro(mealId, getState());
  }
}

export const mealProductQuantityUpdate = (
  mealId: MealId,
  productId: ProductId,
  quantity: number
): Thunk => async (dispatch, getState) => {
  dispatch(productQuantityUpdated(productId, quantity));
  debounceA(async () => {
    await MealProduct.update({ mealId, productId }, { quantity });
    await _updateMealMacro(mealId, getState());
  }, 300);
}

export const mealsFindByDay = (
  dateDay: DateDay
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
  await _updateMealMacro(createdMeal.id, getState());
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
  await _updateMealMacro(mealId, getState());
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