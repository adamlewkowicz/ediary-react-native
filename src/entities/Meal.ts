import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
} from 'typeorm/browser';
import { Product } from './Product';
import { productsRepository } from '../repositories';

@Entity('Meal')
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

}