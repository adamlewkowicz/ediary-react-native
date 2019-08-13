import { Meal, Product, MealProduct } from '../../../database/entities';
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
import { getProductMock } from '../../helpers/diary';
import { ProductUnit, DateDay, ProductId, MealId } from '../../../types';
import { USER_ID_UNSYNCED } from '../../../common/consts';
import { debounce_ } from '../../../common/utils';
import { Omit } from 'yargs';

const debounceA = debounce_();

export const mealCreate = (name: Meal['name']) => async (dispatch: any) => {
  const meal = await Meal.save({ name });
  dispatch(mealToggled(null));
  dispatch(mealCreated(meal));
}

export const mealDelete = (mealId: Meal['id']) => async (dispatch: any) => {
  dispatch(mealDeleted(mealId));
  await Meal.delete(mealId);
}

export const mealUpdate = (
  mealId: Meal['id'],
  meal: Partial<DiaryMealPayload>
) => async (dispatch: any) => {
  dispatch(mealUpdated(mealId, meal));
  await Meal.update(mealId, meal);
}

export const mealProductCreate = (
  mealId: Meal['id'],
  payload: Product
) => async (dispatch: any) => {
  const mockedProduct = { ...payload, ...getProductMock(), userId: USER_ID_UNSYNCED };
  const newProduct = await Meal.addAndCreateProduct(mealId, mockedProduct);
  dispatch(mealProductAdded(mealId, { mealId, ...mockedProduct, ...newProduct }));
}

export const mealProductDelete = (
  mealId: Meal['id'],
  productId: Product['id']
) => async (dispatch: any) => {
  dispatch(mealProductDeleted(mealId, productId));
  await MealProduct.delete({ mealId, productId });
}

export const mealProductQuantityUpdate = (
  mealId: Meal['id'],
  productId: Product['id'],
  quantity: number
) => async (dispatch: any) => {
  dispatch(productUpdated(productId, { quantity }));
  debounceA(async () => {
    await MealProduct.update({ mealId, productId }, { quantity });
  }, 300);
}

export const productUpdate = (
  productId: Product['id'],
  product: Partial<DiaryProductPayload>
) => async (dispatch: any) => {
  dispatch(productUpdated(productId, product));
  await Product.update(productId, product);
}

export const productCreate = (
  product: Omit<DiaryProductPayload, 'id' | 'createdAt' | 'updatedAt' | 'verified'>
) => async (dispatch: any): Promise<Product> => {
  const newProduct = await Product.save(product);
  dispatch(productCreated({ ...product, ...newProduct }));
  return newProduct;
}

export const mealsFindByDay = (
  dateDay: DateDay
) => async (dispatch: any) => {
  const foundMeals = await Meal.findByDay(dateDay);
  dispatch(mealsAdded(foundMeals));
}

export const mealProductAdd = (
  mealId: MealId,
  productId: ProductId,
  quantity: number = 100,
  unit: ProductUnit = 'g'
) => async (dispatch: any) => {
  const { product, created } = await Meal.addProduct(
    mealId,
    productId,
    quantity,
    unit
  );
  if (created) {
    dispatch(
      productUpdated(productId, { quantity: product.quantity })
    );
  } else {
    dispatch(
      mealProductAdded(mealId, product)
    );
  }
}