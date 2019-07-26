import {
  Entity,
  Column,
  ManyToOne,
  Unique,
  PrimaryColumn,
} from 'typeorm/browser';
import { Product } from './Product';
import { Meal } from './Meal';
import { ProductUnit } from '../types';
import { PRODUCT_UNITS } from '../common/consts';

@Entity('MealProduct', {
  name: 'meal_products'
})
@Unique('meal_product', ['mealId', 'productId'])
export class MealProduct {

  @PrimaryColumn()
  mealId!: Meal['id']

  @PrimaryColumn()
  productId!: Product['id']

  @Column('decimal', { precision: 4, scale: 1 })
  quantity!: number

  @Column('enum', { enum: PRODUCT_UNITS })
  unit!: ProductUnit

  @ManyToOne(type => Meal, meal => meal.mealProducts)
  meal!: Meal

  @ManyToOne(type => Product, product => product.mealProducts)
  product!: Product

}