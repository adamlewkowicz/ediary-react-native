import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
} from 'typeorm/browser';
import { MealProduct } from './MealProduct';
import { BarcodeId } from '../types';

@Entity('Product')
export class Product {

  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column('text', { unique: true, nullable: true })
  barcode!: BarcodeId | null

  @Column('decimal', { precision: 5, scale: 2, default: 0 })
  carbs!: number

  @Column('decimal', { precision: 5, scale: 2, default: 0 })
  prots!: number
  
  @Column('decimal', { precision: 5, scale: 2, default: 0 })
  fats!: number

  @Column('decimal', { precision: 5, scale: 2, default: 0 })
  kcal!: number

  @Column('text', { default: () => 'CURRENT_TIMESTAMP' })
  createdAt!: Date;

  @Column('text', { default: () => 'CURRENT_TIMESTAMP' })
  updatedAt!: Date;

  @OneToMany(type => MealProduct, mealProduct => mealProduct.meal)
  mealProducts!: MealProduct[]

}