import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  BaseEntity,
} from 'typeorm/browser';
import { Product } from './Product';
import { productRepository, mealProductRepository } from '../repositories';
import { MealProduct } from './MealProduct';
import * as types from '../types';

@Entity('Meal', {
  name: 'meals'
})
export class Meal extends BaseEntity {

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

  async addProduct(
    productId: Product['id']
  ) {
    const mealId = this.id;
    const product = await productRepository.findOne(productId);

    if (!product) {
      throw new Error(
        `Product with id ${productId} doesn't exist`
      );
    }

    const mealProduct = await mealProductRepository.save({
      productId: product.id,
      mealId
    });

    return { ...product, ...mealProduct };
  }

  async addAndCreateProduct(
    payload: Product
  ) {
    const mealId = this.id;
    const product = await productRepository.save(payload);

    const mealProduct = await mealProductRepository.save({
      productId: product.id,
      mealId
    });

    return { ...product, ...mealProduct };
  }
}