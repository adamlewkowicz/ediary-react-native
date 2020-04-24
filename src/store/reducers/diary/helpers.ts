import { Meal, IProductMerged, Product } from '../../../database/entities';
import {
  DiaryMealTemplate,
  MealTemplate,
  DiaryMeal,
  DiaryProduct,
  DiaryMealOrTemplate,
  DiaryMealOrTemplateId,
} from './types';
import { MealId, TemplateId } from '../../../types';
import * as Utils from '../../../utils';

export const getDiaryMealTemplate = (
  template: MealTemplate
): DiaryMealTemplate => ({
  type: 'template',
  data: template,
  productIds: [],
  isOpened: false,
  isAddingProduct: false,
  timeBase: template.timeBase,
});

export const normalizeProductEntity = (
  productEntity: Product | IProductMerged,
  mealId: MealId,
  quantity: number,
): DiaryProduct => {
  
  const calcedMacro = Utils.calculateMacroPerQuantity(productEntity.macro, quantity);

  const normalizedProduct: DiaryProduct = {
    mealId,
    quantity,
    calcedMacro,
    data: productEntity,
  }
  
  return normalizedProduct;
}

export const normalizeMealEntity = (
  mealEntity: Meal,
  openMealByDefault = false
) => {
  const { mealProducts = [], ...meal } = mealEntity;

  const normalizedMeal: DiaryMeal = {
    data: meal,
    type: 'meal',
    isOpened: openMealByDefault,
    isAddingProduct: false,
    timeBase: Utils.getTimeBaseFromDateTime(meal.date),
    productIds: mealProducts.map(mealProduct => mealProduct.productId),
  }

  const normalizedProducts = mealProducts
    .map<DiaryProduct>(({ product, mealId, quantity }) =>
      normalizeProductEntity(product, mealId, quantity)
    );

  return {
    meal: normalizedMeal,
    products: normalizedProducts
  }
}

export const normalizeMealEntities = (
  payload: Meal[],
  openMealsByDefault = false
): NormalizeMealsResult => {
  return payload.reduce<NormalizeMealsResult>((normalized, mealEntity) => {
    const { meal, products } = normalizeMealEntity(mealEntity, openMealsByDefault);
    
    return {
      meals: [...normalized.meals, meal],
      products: [...normalized.products, ...products]
    }
  }, { meals: [], products: [] });
}

export const isDiaryMeal = (meal: DiaryMealOrTemplate): meal is DiaryMeal => meal.type === 'meal';

export const isEqualMealId = <ID extends DiaryMealOrTemplateId>(
  diaryMealOrTemplate: DiaryMealOrTemplate,
  targetId: ID
): diaryMealOrTemplate is PredictDiaryMealType<ID> => {
  return diaryMealOrTemplate.data.id === targetId;
}

type PredictDiaryMealType<ID extends DiaryMealOrTemplateId> =
  ID extends MealId ? DiaryMeal :
  ID extends TemplateId ? DiaryMealTemplate :
  DiaryMealOrTemplate;

type NormalizeMealsResult = {
  meals: DiaryMeal[]
  products: DiaryProduct[]
}