import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
  Between,
  BeforeInsert,
} from 'typeorm';
import { Product, IProductMerged } from './Product';
import { MealProduct } from './MealProduct';
import { MealId, UserId, DateDay, ProductId } from '../../types';
import { User } from './User';
import { DeepPartial } from 'typeorm';
import { EntityType } from '../types';
import { GenericEntity } from '../generics/GenericEntity';
import dayjs from 'dayjs';
import { DATE_FORMAT, DATE_DAY } from '../../common/consts';
import { DiaryTemplate } from '../../store/reducers/diary';

@Entity('meal')
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

  @OneToMany(
    type => MealProduct,
    mealProduct => mealProduct.meal,
    { cascade: true }
  )
  mealProducts!: MealProduct[]

  @Column('number', { default: null, nullable: true })
  userId!: UserId | null;

  @ManyToOne(type => User, { nullable: true })
  @JoinColumn({ name: 'userId' })
  user!: User;

  static saveWithDate(
    payload: DeepPartial<IMeal>,
    date: Date
  ): Promise<Meal> {
    const formattedDate = dayjs(date).format(DATE_FORMAT);
    return this.save({
      ...payload,
      date: formattedDate
    });
  }

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
  ): Promise<IProductMerged> {
    const product = await Product.save(payload);
    const mealProduct = await MealProduct.save({
      productId: product.id,
      quantity,
      mealId
    });

    return { ...product, ...mealProduct };
  }

  static async addProduct(
    mealId: MealId,
    productId: ProductId,
    quantity?: number
  ): Promise<{ product: IProductMerged, action: 'create' | 'update' }> {
    const product = await Product.findOneOrFail(productId);
    const mealProduct = await MealProduct.findOne({ mealId, productId });
    const portionValue = quantity ? quantity : product.portion;

    if (mealProduct) {
      mealProduct.quantity += portionValue;
      await mealProduct.save();
      const mergedProduct = { ...mealProduct, ...product };
      return { product: mergedProduct, action: 'update'  };
    } else {
      const createdMealProduct = await MealProduct.save({
        quantity: portionValue,
        mealId,
        productId
      });
      const mergedProduct = { ...createdMealProduct, ...product };
      return { product: mergedProduct, action: 'create' };
    }
  }

  static async createWithProduct(
    payload: DeepPartial<IMeal>,
    productId: ProductId,
    quantity?: number
  ): Promise<Meal> {
    const product = await Product.findOneOrFail(productId);

    const newMeal = {
      ...payload,
      mealProducts: [
        {
          productId: product.id,
          quantity: quantity ? quantity : product.portion
        }
      ]
    }

    const createdMeal = await Meal.save(newMeal, { reload: false });
    const mealWithRelations = await Meal.findOneOrFail(createdMeal.id, {
      relations: ['mealProducts', 'mealProducts.product']
    });
    return mealWithRelations; 
  }

  static createFromTemplate(
    template: DiaryTemplate,
    date: Date,
    productId: ProductId,
    quantity?: number,
  ): Promise<Meal> {
    const newMeal = {
      name: template.name,
      date: dayjs(date).format(`${DATE_DAY} ${template.time}`)
    }
    return Meal.createWithProduct(
      newMeal,
      productId,
      quantity
    );
  }

}

export type IMeal = EntityType<Meal>;
export type IMealRequired = IMeal