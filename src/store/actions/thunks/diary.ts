import { 
  Meal,
  Product,
  MealProduct,
  IProductOptional,
  IMeal,
  IProductRequired,
} from '../../../database/entities';
import {
  mealDeleted,
  mealUpdated,
  mealProductDeleted,
  productUpdated,
  mealToggled,
  mealProductAdded,
  mealAdded,
  mealsLoaded,
} from '../creators';
import { DateDay, ProductId, MealId, TemplateId } from '../../../types';
import { debounce, findOrFail } from '../../../common/utils';
import { Thunk, StoreState, Selectors } from '../..';
import { DiaryMeal, DiaryProduct, DiaryTemplate } from '../../reducers/diary';

const debounceA = debounce();

async function _updateMealMacro(mealId: MealId, store: StoreState) {
  const meals = Selectors.calcedMeals(store);
  const foundMeal = meals.find(meal => meal.id === mealId);
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
  dispatch(mealToggled(null));
  dispatch(mealAdded(meal));
}

export const mealDelete = (
  mealId: MealId
): Thunk => async (dispatch) => {
  dispatch(mealDeleted(mealId));
  await Meal.delete(mealId);
}

export const mealUpdate = (
  mealId: Meal['id'],
  meal: Partial<DiaryMeal & IMeal>
): Thunk => async (dispatch, getState) => {
  dispatch(mealUpdated(mealId, meal));
  await Meal.update(mealId, meal);
  await _updateMealMacro(mealId, getState());
}

export const mealProductCreate = (
  mealId: Meal['id'],
  payload: IProductRequired
): Thunk => async (dispatch, getState) => {
  const newProduct = await Meal.addAndCreateProduct(mealId, payload);
  dispatch(mealProductAdded(mealId, { mealId, ...newProduct }));
  await _updateMealMacro(mealId, getState());
}

export const mealProductDelete = (
  mealId: Meal['id'],
  productId: Product['id']
): Thunk => async (dispatch, getState) => {
  const { meals, templates } = getState().diary;
  const meal = findOrFail(meals, meal => meal.id === mealId);
  const template = templates.find(template => template.name === meal.name);
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
  mealId: Meal['id'],
  productId: Product['id'],
  quantity: number
): Thunk => async (dispatch, getState) => {
  dispatch(productUpdated(productId, { quantity }));
  debounceA(async () => {
    await MealProduct.update({ mealId, productId }, { quantity });
    await _updateMealMacro(mealId, getState());
  }, 300);
}

export const productUpdate = (
  productId: Product['id'],
  product: Partial<DiaryProduct>
): Thunk => async (dispatch) => {
  dispatch(productUpdated(productId, product));
  await Product.update(productId, product);
}

export const mealsFindByDay = (
  dateDay: DateDay
): Thunk => async (dispatch) => {
  const foundMeals = await Meal.findByDay(dateDay);
  dispatch(mealsLoaded(foundMeals));
}

export const mealCreateFromTemplate = (
  template: DiaryTemplate,
  date: Date,
  productId: ProductId,
  quantity?: number,
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
  quantity?: number
): Thunk<Promise<void>> => async (dispatch, getState) => {
  const { product, action, rawProduct } = await Meal.addProduct(
    mealId,
    productId,
    quantity
  );
  if (action === 'update') {
    dispatch(
      productUpdated(productId, { quantity: product.quantity })
    );
  } else {
    dispatch(
      mealProductAdded(mealId, product, rawProduct)
    );
  }
  await _updateMealMacro(mealId, getState());
}