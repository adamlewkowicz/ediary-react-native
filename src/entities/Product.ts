import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
  Unique,
} from 'typeorm/browser';
import { MealProduct } from './MealProduct';
import { BarcodeId, ProductId, UserId } from '../types';
import { User } from './User';

@Entity('Product')
@Unique(['name', 'userId'])
@Unique(['name', 'verified'])
export class Product {

  @PrimaryGeneratedColumn()
  id!: ProductId;

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

  @OneToMany(type => MealProduct, mealProduct => mealProduct.product)
  mealProducts!: MealProduct[]

  @Column('boolean', { default: false })
  verified!: boolean;

  @Column('int', { nullable: true })
  userId!: UserId | null;

  @ManyToOne(type => User)
  @JoinColumn({ name: 'userId' })
  user!: User;
  
}