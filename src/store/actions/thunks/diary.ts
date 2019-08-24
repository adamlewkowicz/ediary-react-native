import { Meal, Product, MealProduct, IProduct, IProductOptional } from '../../../database/entities';
import {
  mealCreated,
  mealDeleted,
  mealUpdated,
  mealProductDeleted,
  productUpdated,
  mealToggled,
  productCreated,
  mealsAdded,
  mealProductAdded,
} from '../creators';
import { DiaryMealPayload, DiaryProductPayload } from '../../reducers/diary';
import { DateDay, ProductId, MealId } from '../../../types';
import { debounce_, findOrFail } from '../../../common/utils';
import { Thunk } from '../..';

const debounceA = debounce_();

export const mealCreate = (
  name: Meal['name'],
  date: Date
): Thunk => async (dispatch) => {
  const meal = await Meal.saveWithDate({ name }, date);
  dispatch(mealToggled(null));
  dispatch(mealCreated(meal));
}

export const mealDelete = (
  mealId: MealId
): Thunk => async (dispatch, getState) => {
  const { templates } = getState().diary;
  // const meal = findOn
  dispatch(mealDeleted(mealId));
  if (templates.find()) {

  }
  await Meal.delete(mealId);
}

export const mealUpdate = (
  mealId: Meal['id'],
  meal: Partial<DiaryMealPayload>
): Thunk => async (dispatch) => {
  dispatch(mealUpdated(mealId, meal));
  await Meal.update(mealId, meal);
}

export const mealProductCreate = (
  mealId: Meal['id'],
  payload: IProduct
): Thunk => async (dispatch) => {
  const newProduct = await Meal.addAndCreateProduct(mealId, payload);
  dispatch(mealProductAdded(mealId, { mealId, ...newProduct }));
}

export const mealProductDelete = (
  mealId: Meal['id'],
  productId: Product['id']
): Thunk => async (dispatch, getState) => {
  const { meals } = getState().diary;
  const meal = findOrFail(meals, meal => meal.id === mealId);

  if (meal.isTemplate) {

  }

  dispatch(mealProductDeleted(mealId, productId));
  await MealProduct.delete({ mealId, productId });
}

export const mealProductQuantityUpdate = (
  mealId: Meal['id'],
  productId: Product['id'],
  quantity: number
): Thunk => async (dispatch) => {
  dispatch(productUpdated(productId, { quantity }));
  debounceA(async () => {
    await MealProduct.update({ mealId, productId }, { quantity });
  }, 300);
}

export const productUpdate = (
  productId: Product['id'],
  product: Partial<DiaryProductPayload>
): Thunk => async (dispatch) => {
  dispatch(productUpdated(productId, product));
  await Product.update(productId, product);
}

/**
 * @deprecated - is this action needed, when it doesn't add product to meal?
 */
export const productCreate = (
  product: IProductOptional
): Thunk<Promise<Product>> => async (dispatch): Promise<Product> => {
  const newProduct = await Product.save(product);
  dispatch(productCreated({ ...product, ...newProduct }));
  return newProduct;
}

export const mealsFindByDay = (
  dateDay: DateDay
): Thunk => async (dispatch) => {
  const foundMeals = await Meal.findByDay(dateDay);
  dispatch(mealsAdded(foundMeals));
}

export const mealProductAdd = (
  mealId: MealId,
  productId: ProductId,
  quantity?: number
): Thunk => async (dispatch, getState) => {
  const { meals } = getState().diary;
  const meal = findOrFail(meals, meal => meal.id === mealId);

  if (meal.isTemplate) {
    const newMeal = {
      name: meal.name,
    }
    const createdMeal = await Meal.createWithProduct(
      newMeal,
      productId,
      quantity
    );
    dispatch(mealDeleted(meal.id));
    dispatch(mealsAdded([createdMeal]));
    return;
  }

  const { product, action } = await Meal.addProduct(
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
      mealProductAdded(mealId, product)
    );
  }
}