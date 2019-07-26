import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
} from 'typeorm/browser';
import { Product } from './Product';
import { productsRepository, mealProductRepository } from '../repositories';
import { MealProduct } from './MealProduct';
import * as types from '../types';

@Entity('Meal', {
  name: 'meals'
})
export class Meal {

  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column('decimal', { precision: 5, scale: 2 })
  carbs!: number

  @Column('decimal', { precision: 5, scale: 2 })
  prots!: number
  
  @Column('decimal', { precision: 5, scale: 2 })
  fats!: number

  @Column('decimal', { precision: 5, scale: 2 })
  kcal!: number

  @OneToMany(type => MealProduct, mealProduct => mealProduct.product)
  mealProducts!: MealProduct[]

  static async createProduct(mealId: Meal['id'], payload: Product): Promise<types.Product> {
    const product = await productsRepository.save(payload);
    const mealProduct = await mealProductRepository.save({
      productId: product.id,
      mealId
    });
    return { ...product, ...mealProduct };
  }
}