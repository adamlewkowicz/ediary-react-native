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
import { MealId } from '../types';

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

  @OneToMany(type => MealProduct, mealProduct => mealProduct.product, {
    onDelete: 'CASCADE'
  })
  mealProducts!: MealProduct[]

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
  
  async deleteInCascade() {
    const mealId = this.id;
    const mealProducts = await mealProductRepository().find({ mealId });
    await mealProductRepository().remove(mealProducts);
    await this.remove();
  }
}