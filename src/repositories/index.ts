import { getRepository, getCustomRepository, getConnection } from 'typeorm/browser';
import {
  Product,
  MealProduct
} from '../entities';
import { MealRepository } from './MealRepository';
import { connectionManager } from '../database/manager';

export const productRepository = () => getConnection().getRepository(Product);
export const mealRepository = () => getConnection().getCustomRepository(MealRepository);
export const mealProductRepository = () => getConnection().getRepository(MealProduct);