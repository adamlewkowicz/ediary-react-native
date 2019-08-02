import { getConnection } from 'typeorm/browser';
import {
  Product,
  MealProduct,
  Meal,
  User
} from '../entities';

export const productRepository = () => getConnection().getRepository(Product);
export const mealRepository = () => getConnection().getRepository(Meal);
export const mealProductRepository = () => getConnection().getRepository(MealProduct);
export const userRepository = () => getConnection().getRepository(User);