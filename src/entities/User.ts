import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
} from 'typeorm/browser';
import { UserId } from '../types';
import { IsEmail, IsOptional, MinLength, MaxLength } from 'class-validator';
import { Product } from './Product';
import { Meal } from './Meal';

@Entity('User')
export class User {

  @PrimaryGeneratedColumn()
  id!: UserId;

  @Column({ nullable: true })
  @IsOptional()
  @IsEmail()
  email!: string | null;

  @Column()
  login!: string;

  @Column()
  @MinLength(4)
  @MaxLength(14)
  password!: string;

  @Column('text', { default: () => 'CURRENT_TIMESTAMP' })
  createdAt!: string;

  @Column('text', { default: () => 'CURRENT_TIMESTAMP' })
  updatedAt!: string;

  @OneToMany(type => Product, product => product.userId)
  products!: Product[];
  
  @OneToMany(type => Meal, meal => meal.userId)
  meals!: Meal[];

}