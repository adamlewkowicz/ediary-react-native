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
import { MealId, UserId, DayjsDate, ProductId } from '../../../types';
import { User } from '../User';
import { DeepPartial } from 'typeorm';
import { EntityType } from '../../types';
import { GenericEntity } from '../../generics/GenericEntity';
import dayjs from 'dayjs';
import { DAYJS_DATE_TIME, DAYJS_DATE, MACRO } from '../../../common/consts';
import { MealTemplate } from '../../../store/reducers/diary';
import { GetMacroSummaryResult, GetMacroHistoryResult } from './types';
import * as Utils from '../../../utils';
import { MacroDetailed } from '../../embeds/MacroDetailed';

@Entity('meal')
export class Meal extends GenericEntity {

  @PrimaryGeneratedColumn()
  id!: MealId;

  @Column()
  name!: string;

  @Column(type => MacroDetailed)
  macro!: MacroDetailed;

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
    const formattedDate = dayjs(date).format(DAYJS_DATE_TIME);
    return this.save({
      ...payload,
      date: formattedDate
    });
  }

  static findByDay(dateDay: DayjsDate) {
    return this.find({
      where: { date: Between(`${dateDay} 00:00:00`, `${dateDay} 23:59:59`) },
      relations: ['mealProducts', 'mealProducts.product']
    });
  }

  static async addAndCreateProduct(
    mealId: MealId,
    payload: DeepPartial<Product>,
    quantity = 100
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
  ): Promise<{
    product: IProductMerged
    rawProduct: Product
    action: 'create' | 'update'
  }> {
    const product = await Product.findOneOrFail(productId);
    const mealProduct = await MealProduct.findOne({ mealId, productId });
    const portionValue = quantity ?? product.portion;
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

  static async createWithProductId(
    payload: DeepPartial<Meal>,
    productId: ProductId,
    quantity?: number
  ): Promise<Meal> {
    const product = await Product.findOneOrFail(productId);

    const createdMeal = await Meal.save(payload);

    await MealProduct.save({
      mealId: createdMeal.id,
      productId: product.id,
      quantity: quantity ?? product.portion
    });
    
    const mealWithRelations = await Meal.findOneOrFail(createdMeal.id, {
      relations: ['mealProducts', 'mealProducts.product']
    });

    return mealWithRelations; 
  }

  static createFromTemplate(
    template: MealTemplate,
    date: Date,
    productId: ProductId,
    quantity?: number,
  ): Promise<Meal> {
    const newMeal = {
      name: template.name,
      date: dayjs(date).format(`${DAYJS_DATE} ${template.time}`)
    }
    return Meal.createWithProductId(
      newMeal,
      productId,
      quantity
    );
  }

  static async getMacroHistory(
    endDay: DayjsDate = Utils.getDateFromDateTime(dayjs()),
    daysToSubtract = 7,
  ): Promise<GetMacroHistoryResult[]> {
    const date = dayjs(endDay as any);
    const endDate = date.subtract(daysToSubtract, 'day');
    const startDay = Utils.getDateFromDateTime(endDate);

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

    const filledRecords: GetMacroHistoryResult[] = Array
      .from({ length: daysToSubtract })
      .map<GetMacroHistoryResult>((_, index) => {
        const day = Utils.getDateFromDateTime(endDate.add(index + 1, 'day'));
        const existingRecord = result.find(record => record.day === day);
        if (existingRecord) {
          return existingRecord;
        }
        return { day, ...MACRO };
      });

    return filledRecords;
  }

  static async getMacroSummary(
    startDay: DayjsDate = Utils.getDateFromDateTime(dayjs()),
    daysToSubtract = 7,
  ): Promise<GetMacroSummaryResult> {
    const macroHistory = await this.getMacroHistory(startDay, daysToSubtract);

    const macroAverages = macroHistory.reduce((macro, record, index, self) => {
      const summedMacro = {
        carbs: macro.carbs + record.carbs,
        prots: macro.prots + record.prots,
        fats: macro.fats + record.fats,
        kcal: macro.kcal + record.kcal
      }
      if (index === self.length - 1) {
        return {
          carbs: Math.round(summedMacro.carbs / self.length),
          prots: Math.round(summedMacro.prots / self.length),
          fats: Math.round(summedMacro.fats / self.length),
          kcal: Math.round(summedMacro.kcal / self.length)
        }
      }
      return summedMacro;
    }, { ...MACRO });

    const macroSummary: GetMacroSummaryResult = {
      data: macroHistory,
      average: macroAverages
    }

    return macroSummary;
  }

}

export type IMeal = EntityType<Meal>;
export type IMealRequired = IMeal;