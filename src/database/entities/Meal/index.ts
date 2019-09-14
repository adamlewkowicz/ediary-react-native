import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
  Between,
} from 'typeorm';
import { Product, IProductMerged } from '../Product';
import { MealProduct } from '../MealProduct';
import { MealId, UserId, DateDay, ProductId } from '../../../types';
import { User } from '../User';
import { DeepPartial } from 'typeorm';
import { EntityType } from '../../types';
import { GenericEntity } from '../../generics/GenericEntity';
import dayjs from 'dayjs';
import { DATE_FORMAT, DATE_DAY } from '../../../common/consts';
import { Macro } from '../../embeds/Macro';
import { DiaryTemplate } from '../../../store/reducers/diary';
import { getDayFromDate } from '../../../common/utils';
import { GetMacroSummaryResult, GetMacroHistoryResult } from './types';
import { baseMacro } from '../../../common/helpers';

@Entity('meal')
export class Meal extends GenericEntity {

  @PrimaryGeneratedColumn()
  id!: MealId;

  @Column()
  name!: string;

  @Column(type => Macro)
  macro!: Macro;

  @Column('text', { default: () => 'CURRENT_TIMESTAMP' })
  date!: string;

  @OneToMany(
    type => MealProduct,
    mealProduct => mealProduct.meal,
    { cascade: true }
  )
  mealProducts?: MealProduct[];

  @Column('number', { default: null, nullable: true })
  userId!: UserId | null;

  @ManyToOne(type => User, { nullable: true })
  @JoinColumn({ name: 'userId' })
  user!: User;

  static createWithDate(
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
  ): Promise<{ product: IProductMerged, rawProduct: Product, action: 'create' | 'update' }> {
    const product = await Product.findOneOrFail(productId);
    const mealProduct = await MealProduct.findOne({ mealId, productId });
    const portionValue = quantity ? quantity : product.portion;
    const rawProduct = product;

    if (mealProduct) {
      mealProduct.quantity += portionValue;
      await mealProduct.save();
      const mergedProduct = { ...mealProduct, ...product };
      return { product: mergedProduct, rawProduct, action: 'update' };
    } else {
      const createdMealProduct = await MealProduct.save({
        quantity: portionValue,
        mealId,
        productId
      });
      const mergedProduct = { ...createdMealProduct, ...product };
      return { product: mergedProduct, rawProduct, action: 'create' };
    }
  }

  static async createWithProduct(
    payload: DeepPartial<Meal>,
    productId: ProductId,
    quantity?: number
  ): Promise<Meal> {
    const product = await Product.findOneOrFail(productId);

    const createdMeal = await Meal.save(payload);
    await MealProduct.save({
      mealId: createdMeal.id,
      productId: product.id,
      quantity: quantity || product.portion
    });
    
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

  static async getMacroHistory(
    startDay: DateDay,
    periodInDays = 7,
  ): Promise<GetMacroHistoryResult[]> {
    const datePeriod = dayjs(startDay as any).add(periodInDays, 'day');
    const endDay = getDayFromDate(datePeriod);

    const result: GetMacroHistoryResult[] = await Meal
      .createQueryBuilder('meal')
      .select('DATE(meal.date)', 'day')
      .addSelect('SUM(meal.carbs)', 'carbs')
      .addSelect('SUM(meal.prots)', 'prots')
      .addSelect('SUM(meal.fats)', 'fats')
      .addSelect('SUM(meal.kcal)', 'kcal')
      .where('meal.date >= :startDate', { startDate: `${startDay} 00:00:00` })
      .andWhere('meal.date <= :endDate', { endDate: `${endDay} 23:59:00` })
      .groupBy('day')
      .getRawMany();

    return result;
  }

  static async getMacroSummary(
    startDay: DateDay,
    periodInDays?: number,
  ): Promise<GetMacroSummaryResult> {
    const macroHistory = await this.getMacroHistory(startDay, periodInDays);

    const macroAverages = macroHistory.reduce((macro, record, index, self) => {
      const summedMacro = {
        carbs: macro.carbs + record.carbs,
        prots: macro.prots + record.prots,
        fats: macro.fats + record.fats,
        kcal: macro.kcal + record.kcal
      }
      if (index === self.length - 1) {
        return {
          carbs: summedMacro.carbs / self.length,
          prots: summedMacro.prots / self.length,
          fats: summedMacro.fats / self.length,
          kcal: summedMacro.kcal / self.length 
        }
      }
      return summedMacro;
    }, { ...baseMacro });

    const macroSummary: GetMacroSummaryResult = {
      data: macroHistory,
      average: macroAverages
    }

    return macroSummary;
  }

}

export type IMeal = EntityType<Meal>;
export type IMealRequired = IMeal