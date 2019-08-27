import {
  MEAL_CREATED,
  MEAL_UPDATED,
  MEAL_DELETED,
  MEAL_PRODUCT_DELETED,
  PRODUCT_UPDATED,
  MEAL_TOGGLED,
  PRODUCT_CREATED,
  MEALS_ADDED,
  PRODUCT_TOGGLED,
  MEAL_PRODUCT_ADDED,
  MEAL_TEMPLATE_TOGGLED,
  MEAL_ADDED_FROM_TEMPLATE,
} from '../../consts';
import { Meal, Product, IProduct } from '../../../database/entities';
import {
  DiaryMealPayload,
  DiaryProductPayload,
} from '../../reducers/diary';
import { ProductId, TemplateId, MealId } from '../../../types';

export type MealCreated = {
  type: typeof MEAL_CREATED
  payload: Meal
}

export type MealUpdated = {
  type: typeof MEAL_UPDATED
  payload: Partial<DiaryMealPayload>
  meta: { mealId: Meal['id'] }
}

export type MealDeleted = {
  type: typeof MEAL_DELETED
  meta: { mealId: Meal['id'] }
}

export type MealProductAdded = {
  type: typeof MEAL_PRODUCT_ADDED
  payload: DiaryProductPayload
  meta: { mealId: Meal['id'] }
}

export type MealProductDeleted = {
  type: typeof MEAL_PRODUCT_DELETED
  meta: {
    mealId: Meal['id']
    productId: Product['id']
  }
}

export type ProductUpdated = {
  type: typeof PRODUCT_UPDATED
  payload: Partial<DiaryProductPayload>
  meta: {
    productId: Product['id']
  }
}

export type MealToggled = {
  type: typeof MEAL_TOGGLED
  meta: {
    targetId: MealId | null
  }
}

export type ProductCreated = {
  type: typeof PRODUCT_CREATED
  payload: IProduct
}

export type MealsAdded = {
  type: typeof MEALS_ADDED
  payload: Meal[]
  meta: {
    templateId?: TemplateId
  }
}

export type ProductToggled = {
  type: typeof PRODUCT_TOGGLED
  payload: ProductId | null
}

export type MealTemplateToggled = {
  type: typeof MEAL_TEMPLATE_TOGGLED
  meta: {
    targetId: TemplateId | null
  }
}

export type MealAddedFromTemplate = {
  type: typeof MEAL_ADDED_FROM_TEMPLATE
  payload: Meal
  meta: {
    templateId?: TemplateId
  }
}

export type DiaryActions =
  | MealCreated 
  | MealUpdated 
  | MealDeleted 
  | MealProductAdded
  | MealProductDeleted
  | ProductUpdated
  | MealToggled
  | ProductCreated
  | MealsAdded
  | ProductToggled
  | MealTemplateToggled
  | MealAddedFromTemplate