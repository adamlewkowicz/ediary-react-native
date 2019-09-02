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
import { MealProduct, IMealProduct } from './MealProduct';
import { BarcodeId, ProductId, UserId, ProductUnit } from '../../types';
import { User } from './User';
import { ProductPortion } from './ProductPortion';
import { friscoApi } from '../../services/FriscoApi';
import { SqliteENUM } from '../decorators';
import { EntityType } from '../types';
import { Optional, Omit } from 'utility-types';
import { PRODUCT_UNITS } from '../../common/consts';
import { ilewazyApi } from '../../services/IlewazyApi';
import { mapAsyncSequence, filterByUniqueId } from '../../common/utils';
import { MinLength } from 'class-validator';
import { GenericEntity } from '../generics/GenericEntity';
import { ProductImage } from './ProductImage';
import { Macro } from '../embeds/Macro';

@Entity('product')
// @Unique(['name', 'userId'])
// @Unique(['name', 'verified'])
@Unique(['barcode', 'userId'])
@Unique(['barcode', 'verified'])
export class Product extends GenericEntity {

  @PrimaryGeneratedColumn()
  id!: ProductId;

  @Column()
  @MinLength(2, {
    message: 'Nazwa musi zawierać przynajmniej $constraint1 znaki'
  })
  name!: string;

  @Column('text', { nullable: true })
  barcode!: BarcodeId | null

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

  @Column('boolean', { default: false })
  verified!: boolean;

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
    productImage => productImage,
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

  static findByNameLike(name: string, limit: number = 10): Promise<Product[]> {
    return this.find({
      where: { name: Like(`%${name}%`) },
      take: limit
    });
  }

  static async findAndFetchByNameLike(name: string): Promise<Product[]> {
    const savedProducts = await Product.findByNameLike(name);

    if (savedProducts.length <= 3) {
      const fetchedProducts = await ilewazyApi.findByName(name);

      if (fetchedProducts.length) {
        const foundOrCreatedProducts = await mapAsyncSequence(fetchedProducts, product => {
          const { carbs, prots, fats, kcal, ...data } = product;
          const parsedProduct = {
            ...data,
            images: product.images.map(url => ({ url })),
            verified: true,
            macro: { carbs, prots, fats, kcal },
          }
          const query = {
            where: {
              name: product.name,
              verified: true
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
    const hasVerifiedProduct = savedProducts.some(product => product.verified);
    
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
          verified: true,
          macro
        }
        return this.save(parsedProduct);
      });

      return [...savedProducts, ...createdProducts];
    }

    return savedProducts;
  }

}

export type IProduct = Omit<EntityType<Product>, 'portion'>;
export type IProductOptional = Optional<IProduct, 'id' | 'updatedAt' | 'createdAt' | 'mealProducts' | 'portions' | 'user' | 'verified' | 'images'>;
export type IProductMerged = IProduct & IMealProduct;