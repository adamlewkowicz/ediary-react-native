import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
  Between,
} from 'typeorm';
import { Product, IProduct, IProductMerged } from './Product';
import { MealProduct } from './MealProduct';
import { MealId, UserId, DateDay, ProductUnit, ProductId } from '../../types';
import { User } from './User';
import { USER_ID_UNSYNCED } from '../../common/consts';
import { GenericEntity } from './Generic';
import { DeepPartial } from 'typeorm';
import { EntityType } from '../types';

@Entity('Meal', {
  name: 'meals'
})
export class Meal extends GenericEntity {

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

  static findByDay(dateDay: DateDay) {
    return this.find({
      where: { date: Between(`${dateDay} 00:00:00`, `${dateDay} 23:59:59`) },
      relations: ['mealProducts', 'mealProducts.product']
    });
  }

  static async addAndCreateProduct(
    mealId: MealId,
    payload: DeepPartial<Product>,
    quantity: number = 100
  ): Promise<IProduct> {
    const product = await Product.save(payload);
    const mealProduct = await MealProduct.save({
      productId: product.id,
      unit: product.unit,
      quantity,
      mealId
    });

    return { ...product, ...mealProduct };
  }

  static async addProduct(
    mealId: MealId,
    productId: ProductId,
    quantity: number = 100,
    unit: ProductUnit = 'g'
  ): Promise<{ product: IProductMerged, created: boolean }> {
    const [product, mealProduct] = await Promise.all([
      Product.findOneOrFail(productId),
      MealProduct.findOne({ mealId, productId })
    ]);
    const [portion] = product.portions;
    const portionValue = portion ? portion.value : quantity;

    if (mealProduct) {
      mealProduct.quantity += portionValue;
      await mealProduct.save();
      const mergedProduct = { ...mealProduct, ...product };
      return { product: mergedProduct, created: false  };
    } else {
      const createdMealProduct = await MealProduct.save({
        quantity: portionValue,
        mealId,
        productId,
        unit
      });
      const mergedProduct = { ...createdMealProduct, ...product };
      return { product: mergedProduct, created: true };
    }
  }

}

export type IMeal = EntityType<Meal>;