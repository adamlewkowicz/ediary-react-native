import { Meal, Product, MealProduct } from '../../../entities';
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
import {
  mealRepository,
  mealProductRepository, 
  productRepository
} from '../../../repositories';
import { DiaryMealPayload, DiaryProductPayload } from '../../reducers/diary';
import { getProductMock } from '../../helpers/diary';
import { getRepository } from 'typeorm/browser';
import { AppState } from '../..';
import { ProductUnit, DateDay } from '../../../types';
import { MealsWithRatio } from '../../selectors';
import { USER_ID_UNSYNCED } from '../../../common/consts';


export const mealCreate = (name: Meal['name']) => async (dispatch: any) => {
  const meal = Meal.create({ name });
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
  const meal = await mealRepository().findOneOrFail(mealId);
  const mockedProduct = { ...payload, ...getProductMock(), userId: USER_ID_UNSYNCED };
  const newProduct = await meal.addAndCreateProduct(mockedProduct);
  dispatch(mealProductAdded(mealId, { ...mockedProduct, ...newProduct }));
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
  product: Partial<DiaryProductPayload>
) => async (dispatch: any) => {
  dispatch(productUpdated(productId, product));
  await productRepository().update(productId, product);
}

export const productCreate = (
  product: Omit<DiaryProductPayload, 'id' | 'createdAt' | 'updatedAt' | 'verified'>
) => async (dispatch: any): Promise<Product> => {
  const newProduct = await productRepository().save(product);
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
  meal: MealsWithRatio[number],
  product: Product,
  quantity: number = 100,
  unit: ProductUnit = 'g'
) => async (dispatch: any, getState: () => AppState) => {
  const mealId = meal.id;
  const productId = product.id;

  if (meal.productIds.includes(product.id)) {
    const existingProduct = getState().diary.products.find(anyProduct =>
      anyProduct.id === productId
    );

    if (!existingProduct) return;

    const updatedQuantity = existingProduct.quantity += quantity;

    dispatch(
      productUpdated(productId, {
        quantity: updatedQuantity
      })
    );
    await getRepository(MealProduct).update(
      { mealId, productId },
      { quantity: updatedQuantity }
    );

  } else {
    dispatch(
      mealProductAdded(mealId, {
        ...product,
        mealId,
        quantity,
        unit
      })
    );

    await getRepository(MealProduct).save({
      mealId, productId, quantity, unit
    });
  }
}