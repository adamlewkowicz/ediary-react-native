import {
  Entity,
  Column,
  ManyToOne,
  PrimaryColumn,
  JoinColumn,
} from 'typeorm';
import { Product } from './Product';
import { Meal } from './Meal';
import { GenericEntity } from './Generic';
import { EntityType } from '../types';

@Entity('meal_product')
export class MealProduct extends GenericEntity {

  @PrimaryColumn()
  mealId!: Meal['id']

  @PrimaryColumn()
  productId!: Product['id']

  @Column('decimal', { precision: 4, scale: 1 })
  quantity!: number

  @ManyToOne(
    type => Meal,
    meal => meal.mealProducts,
    { onDelete: 'CASCADE' }
  )
  @JoinColumn({ name: 'mealId' })
  meal!: Meal

  @ManyToOne(
    type => Product,
    product => product.mealProducts
  )
  @JoinColumn({ name: 'productId' })
  product!: Product

}

export type IMealProduct = EntityType<MealProduct>;