import { getRepository } from 'typeorm/browser';
import {
  Product,
  Meal,
  MealProduct
} from './entities';

export const productsRepository = getRepository(Product);
export const mealsRepository = getRepository(Meal);
export const mealProductRepository = getRepository(MealProduct);