import { getRepository } from 'typeorm/browser';
import {
  Product,
  Meal
} from './entities';

export const productsRepository = getRepository(Product);
export const mealsRepository = getRepository(Meal);