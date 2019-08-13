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
import { GenericEntity } from './Generic';
import { SqliteENUM } from '../decorators';
import { PRODUCT_UNITS } from '../../common/consts';
import { EntityType } from '../types';

@Entity('Product')
// @Unique(['name', 'userId'])
// @Unique(['name', 'verified'])
export class Product extends GenericEntity {

  @PrimaryGeneratedColumn()
  id!: ProductId;

  @Column()
  name!: string;

  @Column('text', { unique: true, nullable: true })
  barcode!: BarcodeId | null

  @Column('decimal', { precision: 5, scale: 2, default: 0 })
  carbs!: number

  @Column('decimal', { precision: 5, scale: 2, default: 0 })
  prots!: number
  
  @Column('decimal', { precision: 5, scale: 2, default: 0 })
  fats!: number

  @Column('decimal', { precision: 5, scale: 2, default: 0 })
  kcal!: number

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
    type => ProductPortion,
    productPortion => productPortion.product,
    { onDelete: 'CASCADE' }
  )
  portions!: ProductPortion[];

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

}

export type IProduct = EntityType<Product>;
export type IProductMerged = IProduct & IMealProduct;