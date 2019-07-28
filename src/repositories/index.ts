import { getRepository, getCustomRepository, getConnection } from 'typeorm/browser';
import {
  Product,
  MealProduct,
  Meal
} from '../entities';
import { MealRepository } from './MealRepository';
import { connectionManager } from '../database/manager';

export const productRepository = () => getConnection().getRepository(Product);
export const mealRepository = () => getConnection().getRepository(Meal);
export const mealProductRepository = () => getConnection().getRepository(MealProduct);