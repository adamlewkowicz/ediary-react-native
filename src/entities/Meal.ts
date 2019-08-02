import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  BaseEntity,
  ManyToOne,
  JoinColumn,
} from 'typeorm/browser';
import { Product } from './Product';
import { productRepository, mealProductRepository } from '../repositories';
import { MealProduct } from './MealProduct';
import { MealId, UserId } from '../types';
import { User } from './User';
import { USER_ID_UNSYNCED } from '../common/consts';

@Entity('Meal', {
  name: 'meals'
})
export class Meal extends BaseEntity {

  @PrimaryGeneratedColumn()
  id!: MealId;

  @Column()
  name!: string;

  @Column('decimal', { precision: 5, scale: 2, default: 0 })
  carbs!: number

  @Column('decimal', { precision: 5, scale: 2, default: 0 })
  prots!: number
  
  @Column('decimal', { precision: 5, scale: 2, default: 0 })
  fats!: number

  @Column('decimal', { precision: 5, scale: 2, default: 0 })
  kcal!: number

  @Column('text', { default: () => 'CURRENT_TIMESTAMP' })
  date!: string;

  @OneToMany(type => MealProduct, mealProduct => mealProduct.meal, {
    onDelete: 'CASCADE'
  })
  mealProducts!: MealProduct[]

  @Column('number', { default: USER_ID_UNSYNCED })
  userId!: UserId | null;

  @ManyToOne(type => User)
  @JoinColumn({ name: 'userId' })
  user!: User;

  async addProduct(
    productId: Product['id']
  ) {
    const mealId = this.id;
    const product = await productRepository().findOne(productId);

    if (!product) {
      throw new Error(
        `Product with id ${productId} doesn't exist`
      );
    }

    const mealProduct = await mealProductRepository().save({
      productId: product.id,
      mealId
    });

    return { ...product, ...mealProduct };
  }

  async addAndCreateProduct(
    payload: Product
  ) {
    const mealId = this.id;
    const product = await productRepository().save(payload);
    const quantity = 100;
    const unit = 'g';

    const mealProduct = await mealProductRepository().save({
      productId: product.id,
      mealId,
      quantity,
      unit
    });

    return { ...product, ...mealProduct };
  }

}