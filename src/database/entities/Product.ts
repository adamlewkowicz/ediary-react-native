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
import { BarcodeId, ProductId, UserId } from '../../types';
import { User } from './User';
import { ProductPortion } from './ProductPortion';
import { friscoApi } from '../../services/FriscoApi';
import { GenericEntity } from './Generic';
import { EntityType } from '../types';
import { Optional, DeepPartial } from 'utility-types';
import { ProductMacro, IProductMacroOptional } from './ProductMacro';

@Entity('product')
// @Unique(['name', 'userId'])
// @Unique(['name', 'verified'])
export class Product extends GenericEntity {

  @PrimaryGeneratedColumn()
  id!: ProductId;

  @Column()
  name!: string;

  @Column('text', { unique: true, nullable: true })
  barcode!: BarcodeId | null

  @Column('text', { default: () => 'CURRENT_TIMESTAMP' })
  createdAt!: Date;

  @Column('text', { default: () => 'CURRENT_TIMESTAMP' })
  updatedAt!: Date;

  @OneToMany(type => MealProduct, mealProduct => mealProduct.product)
  mealProducts!: MealProduct[]

  @Column('boolean', { default: false })
  verified!: boolean;

  @Column('int', { nullable: true })
  userId!: UserId | null;

  @ManyToOne(type => User)
  @JoinColumn({ name: 'userId' })
  user!: User;

  @OneToMany(
    type => ProductMacro,
    productMacro => productMacro.product,
    { cascade: true, eager: true }
  )
  macro!: ProductMacro[];

  @OneToMany(
    type => ProductPortion,
    productPortion => productPortion.product,
    { cascade: true }
  )
  portions?: ProductPortion[];

  /*
  get portion(): number | any {
    const [firstPortion] = this.portions;
    const defaultPortion = 100;

    if (firstPortion) {
      return firstPortion.value;
    }
    return defaultPortion;
  }
  */

  static async findByNameLike(name: string, limit: number = 10): Promise<Product[]> {
    return this.find({
      where: { name: Like(`%${name}%`) },
      take: limit
    });
  }

  static async findByBarcode(barcode: BarcodeId): Promise<Product[]> {
    const savedProducts = await this.find({ barcode });
    const hasVerifiedProduct = savedProducts.some(product => product.verified);
    
    if (!savedProducts.length || !hasVerifiedProduct) {
      const fetchedProducts = await friscoApi.findByQuery(barcode);
      const createdProducts = await Promise.all(
        fetchedProducts.map(({ unit, portions, ...product }) => this.save({
          ...product,
          verified: true
        }))
      );
      return createdProducts;
    }

    return savedProducts;
  }

  // rename to save
  static async createWithMacro(
    payload: DeepPartial<IProduct>,
    macro: IProductMacroOptional[]
  ): Promise<Product> {
    const product = await Product.save({
      ...payload,
      macro
    });
    return product;
  }

}

export type IProduct = EntityType<Product>;
export type IProductOptional = Optional<IProduct, 'id' | 'updatedAt' | 'createdAt' | 'mealProducts' | 'portions' | 'user' | 'verified'>;
export type IProductMerged = IProduct & IMealProduct;