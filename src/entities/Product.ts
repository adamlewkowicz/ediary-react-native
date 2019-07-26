import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  Unique,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm/browser';
import { MealProduct } from './MealProduct';

@Entity('Product')
export class Product {

  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column('string', { unique: true, nullable: true })
  barcode!: string | null

  @Column('decimal', { precision: 5, scale: 2 })
  carbs!: number

  @Column('decimal', { precision: 5, scale: 2 })
  prots!: number
  
  @Column('decimal', { precision: 5, scale: 2 })
  fats!: number

  @Column('decimal', { precision: 5, scale: 2 })
  kcal!: number

  @CreateDateColumn('timestamp')
  createdAt!: Date;

  @UpdateDateColumn('timestamp')
  updatedAt!: Date;

  @OneToMany(type => MealProduct, mealProduct => mealProduct.meal)
  mealProducts!: MealProduct[]

}