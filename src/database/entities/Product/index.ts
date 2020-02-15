import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
  Unique,
  Like,
} from 'typeorm';
import { MealProduct, IMealProduct } from '../MealProduct';
import { BarcodeId, ProductId, UserId, ProductUnit } from '../../../types';
import { User } from '../User';
import { ProductPortion } from '../ProductPortion';
import { friscoApi } from '../../../services/FriscoApi';
import { SqliteENUM } from '../../decorators';
import { EntityType, EntityRequired } from '../../types';
import { PRODUCT_UNITS } from '../../../common/consts';
import { ilewazyApi } from '../../../services/IlewazyApi';
import { mapAsyncSequence, filterByUniqueId } from '../../../common/utils';
import { MinLength } from 'class-validator';
import { GenericEntity } from '../../generics/GenericEntity';
import { ProductImage } from '../ProductImage';
import { Macro } from '../../embeds/Macro';
import { FindMostUsedResult, FindMostProductIdsResult } from './types';

@Entity('product')
@Unique<Product>(['name', 'isVerified'])
@Unique<Product>(['barcode', 'userId'])
@Unique<Product>(['barcode', 'isVerified'])
export class Product extends GenericEntity {

  @PrimaryGeneratedColumn()
  id!: ProductId;

  @Column()
  @MinLength(2, {
    message: 'Nazwa musi zawierać przynajmniej $constraint1 znaki'
  })
  name!: string;

  @Column('text', { nullable: true })
  barcode!: BarcodeId | null;

  @Column(type => Macro)
  macro!: Macro;

  /**
   * Type of unit that describes macro values.
   * Each macro value describes it's value in 100 units of this type.  
  */
  @Column('text', { default: 'g' })
  @SqliteENUM(PRODUCT_UNITS)
  unit!: ProductUnit;

  @Column('text', { default: () => 'CURRENT_TIMESTAMP' })
  createdAt!: Date;

  @Column('text', { default: () => 'CURRENT_TIMESTAMP' })
  updatedAt!: Date;

  @OneToMany(
    type => MealProduct,
    mealProduct => mealProduct.product
  )
  mealProducts?: MealProduct[]

  @Column('boolean', { nullable: true })
  isVerified!: boolean | null;

  @Column('int', { nullable: true })
  userId!: UserId | null;

  @ManyToOne(type => User)
  @JoinColumn({ name: 'userId' })
  user!: User;

  @OneToMany(
    type => ProductPortion,
    productPortion => productPortion.product,
    { cascade: true, eager: true }
  )
  portions?: ProductPortion[];

  @OneToMany(
    type => ProductImage,
    productImage => productImage.product,
    { cascade: true }
  )
  images?: ProductImage[];

  get portion(): number {
    const defaultPortion = 100;

    if (this.portions && this.portions.length) {
      const [firstPortion] = this.portions;
      return firstPortion.value;
    }

    return defaultPortion;
  }

  static findByNameLike(name: string, limit = 10): Promise<Product[]> {
    return this.find({
      where: { name: Like(`%${name}%`) },
      take: limit
    });
  }

  static async findMostUsed(): Promise<FindMostUsedResult[]> {
    const result: FindMostProductIdsResult[] = await MealProduct
      .createQueryBuilder('meal_product')
      .select('meal_product.productId', 'productId')
      .addSelect('COUNT(*)', 'count')
      .groupBy('meal_product.productId')
      .orderBy('count', 'DESC')
      .limit(100)
      .getRawMany();

    const productIds = result.map(data => data.productId);

    const products = await Product.findByIds(productIds);
    const normalized: FindMostUsedResult[] = products.map((product, index) => ({
      product,
      ...result[index]
    }));
    return normalized;
  }

  static async findRecentlyUsed(): Promise<Product[]> {
    const result: { id: ProductId }[] = await MealProduct
      .createQueryBuilder('meal_product')
      .select('meal_product.productId', 'id')
      .groupBy('meal_product.productId')
      .orderBy('meal_product.mealId', 'DESC')
      .limit(4)
      .getRawMany();

    const productIds = result.map(data => data.id);

    return Product.findByIds(productIds);
  }

  static async findAndFetchByNameLike(name: string): Promise<Product[]> {
    const savedProducts = await Product.findByNameLike(name);

    if (savedProducts.length <= 3) {
      const fetchedProducts = await ilewazyApi.findByName(name);

      if (fetchedProducts.length) {
        const foundOrCreatedProducts = await mapAsyncSequence(fetchedProducts, async (product) => {
          const {
            images = [],
            carbs,
            prots,
            fats,
            kcal,
            unit,
            portion,
            ...data
          } = product;
          const parsedProduct = {
            ...data,
            images: images.map(url => ({ url })),
            isVerified: true,
            macro: { carbs, prots, fats, kcal },
          }
          const query = {
            where: {
              name: product.name,
              isVerified: true
            }
          }
          return this.findOneOrSave(query, parsedProduct);
        });

        const mergedProducts = [...savedProducts, ...foundOrCreatedProducts]
          .filter(filterByUniqueId);
        
        return mergedProducts;
      }
    }

    return savedProducts;
  }

  static findByBarcode(barcode: BarcodeId): Promise<Product[]> {
    return this.find({ barcode });
  }

  static async findAndFetchByBarcode(barcode: BarcodeId): Promise<Product[]> {
    const savedProducts = await this.findByBarcode(barcode);
    const hasVerifiedProduct = savedProducts.some(product => product.isVerified);
    
    if (!savedProducts.length || !hasVerifiedProduct) {
      const fetchedProducts = await friscoApi.findByQuery(barcode);
      const createdProducts = await mapAsyncSequence(fetchedProducts, product => {
        const {
          unit,
          portion,
          portions,
          images = [],
          carbs,
          prots,
          fats,
          kcal,
          ...data
        } = product;
        const macro = { carbs, prots, fats, kcal };
        const parsedProduct = {
          ...data,
          images: images.map(url => ({ url })),
          isVerified: true,
          macro
        }
        return this.save(parsedProduct);
      });

      return [...savedProducts, ...createdProducts];
    }

    return savedProducts;
  }

}

export type IProduct = EntityType<Product, 'portion'>;
export type IProductRequired = EntityRequired<IProduct,
  | 'name'
  | 'macro'
>;
export type IProductMerged = IProduct & IMealProduct;