import {
  Entity,
  Column,
  ManyToOne,
  Unique,
  PrimaryColumn,
  Check,
} from 'typeorm/browser';
import { Product } from './Product';
import { Meal } from './Meal';
import { ProductUnit } from '../types';
import { PRODUCT_UNITS } from '../common/consts';

const productUnitsEnum = PRODUCT_UNITS.map(unit => `'${unit}'`).join(',');

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

  @Column('text')
  @Check(`unit IN (${productUnitsEnum}) `)
  unit!: ProductUnit

  @ManyToOne(type => Meal, meal => meal.mealProducts)
  meal!: Meal

  @ManyToOne(type => Product, product => product.mealProducts)
  product!: Product

}