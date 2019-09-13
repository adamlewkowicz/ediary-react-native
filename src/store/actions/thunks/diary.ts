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
  productCreated,
  mealProductAdded,
  mealAdded,
  mealsLoaded,
  productsRecentLoaded,
} from '../creators';
import { DateDay, ProductId, MealId, TemplateId } from '../../../types';
import { debounce_, findOrFail } from '../../../common/utils';
import { Thunk, StoreState, Selectors } from '../..';
import { DiaryMeal, DiaryProduct, DiaryTemplate } from '../../reducers/diary';

const debounceA = debounce_();

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
  templateId: TemplateId | null,
): Thunk => async (dispatch) => {
  const meal = await Meal.createWithDate({ name }, date);
  dispatch(mealToggled(null));
  dispatch(mealAdded(meal, templateId));
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
  _updateMealMacro(mealId, getState());
}

export const mealProductCreate = (
  mealId: Meal['id'],
  payload: IProductRequired
): Thunk => async (dispatch, getState) => {
  const newProduct = await Meal.addAndCreateProduct(mealId, payload);
  dispatch(mealProductAdded(mealId, { mealId, ...newProduct }));
  _updateMealMacro(mealId, getState());
}

export const mealProductDelete = (
  mealId: Meal['id'],
  productId: Product['id']
): Thunk => async (dispatch, getState) => {
  const { meals } = getState().diary;
  const meal = findOrFail(meals, meal => meal.id === mealId);
  
  if (meal.productIds.length === 1 && meal.templateId !== null) {
    dispatch(mealDeleted(mealId));
    await Meal.delete(mealId);
  } else {
    dispatch(mealProductDeleted(mealId, productId));
    await MealProduct.delete({ mealId, productId });
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
    _updateMealMacro(mealId, getState());
  }, 300);
}

export const productUpdate = (
  productId: Product['id'],
  product: Partial<DiaryProduct>
): Thunk => async (dispatch) => {
  dispatch(productUpdated(productId, product));
  await Product.update(productId, product);
}

/**
 * @deprecated - this action is needed, when it doesn't add product to meal
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
    mealAdded(createdMeal, template.id)
  );
  _updateMealMacro(createdMeal.id, getState());
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
  _updateMealMacro(mealId, getState());
}

export const productsLoadRecent = (): Thunk => async (dispatch) => {
  const recentProducts = await Product.findRecentlyUsed();
  if (recentProducts.length) {
    dispatch(productsRecentLoaded(recentProducts));
  }
}