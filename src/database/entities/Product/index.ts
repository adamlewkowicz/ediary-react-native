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
import {
  BarcodeId,
  ProductId,
  UserId,
  ProductUnitType,
  FilterHOF,
  NormalizedProduct,
} from '../../../types';
import { User } from '../User';
import { ProductPortion } from '../ProductPortion';
import { SqliteENUM } from '../../decorators';
import { EntityType, EntityRequired } from '../../types';
import { PRODUCT_UNIT_TYPE } from '../../../common/consts';
import { MinLength } from 'class-validator';
import { GenericEntity } from '../../generics/GenericEntity';
import { ProductImage } from '../ProductImage';
import { Macro } from '../../embeds/Macro';
import { FindMostUsedResult, FindMostProductIdsResult } from './types';
import * as Utils from '../../../utils';
import { ProductSearchApi } from '../../../services/ProductSearchApi';
import { ProductFavorite } from '../ProductFavorite';

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
  @SqliteENUM(PRODUCT_UNIT_TYPE)
  unit!: ProductUnitType;

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

  @OneToMany(
    type => ProductFavorite,
    productFavorite => productFavorite.product,
    { onDelete: 'CASCADE' }
  )
  favorites?: ProductFavorite[];

  static defaultPortion = 100;

  get portion(): number {
    if (this.portions?.length) {
      const [firstPortion] = this.portions;
      return firstPortion.value;
    }
    return Product.defaultPortion;
  }

  private static searchApi = new ProductSearchApi();
  
  static saveWithPortion(
    productData: IProductRequired,
    portionQuantity: number,
    portionType = 'portion'
  ): Promise<Product> {
    if (
      portionQuantity > 0 &&
      portionQuantity !== Product.defaultPortion
    ) {
      return Product.save({
        ...productData,
        portions: [
          {
            type: portionType,
            value: portionQuantity,
          }
        ],
      });
    }

    return Product.save(productData);
  }

  private normalizePortionQuantity() {

  }

  static updateWithPortion(
    productData: IProductRequired,
    portionQuantity: number,
  ) {

  }

  static findByNameLike(name: string): Promise<Product[]> {
    const limit = 10;
    
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

  private static filterProductsByNameAndInstance: FilterHOF<ProductOrNormalizedProduct> = (
    currentProduct, currentIndex, products
  ) => {
    const REMOVE = false;
    const PRESERVE = true;

    const hasProductWithExactName = products.some((anyProduct, index) => {
      const isNotCurrentProductIndex = index !== currentIndex;
      const hasExactName = anyProduct.name === currentProduct.name;
      return isNotCurrentProductIndex && hasExactName;
    });

    const isNotInstanceOfProduct = !(currentProduct instanceof Product);

    if (hasProductWithExactName && isNotInstanceOfProduct) {
      return REMOVE;
    }

    return PRESERVE;
  }
  
  static async findAndFetchByNameLike(
    name: string,
    controller: AbortController,
  ): Promise<ProductOrNormalizedProduct[]> {

    const savedProducts = await Product.findByNameLike(name);
    const minProductsFoundLimit = 3;
    const sortByMostAccurateProductName = Utils.sortByMostAccurateName(name);

    if (savedProducts.length <= minProductsFoundLimit) {
      try {
        const fetchedProducts = await Product.searchApi.findByName(name, controller);

        const mergedProducts = [...savedProducts, ...fetchedProducts]
          .filter(Product.filterProductsByNameAndInstance)
          .sort(sortByMostAccurateProductName);
  
        return mergedProducts;
      } catch(error) {
        Utils.handleError(error);

        return savedProducts.sort(sortByMostAccurateProductName);
      }
    }

    return savedProducts.sort(sortByMostAccurateProductName);
  }

  static findByBarcode(barcode: BarcodeId): Promise<Product[]> {
    return this.find({ barcode });
  }

  private static parseNormalizedProduct(payload: NormalizedProduct) {
    const {
      images = [],
      unit,
      portion,
      _id,
      ...data
    } = payload;

    const parsedProduct = {
      ...data,
      images: images.map(url => ({ url })),
      isVerified: true,
    }
    
    return parsedProduct;
  }

  static saveNormalizedProduct(payload: NormalizedProduct): Promise<Product> {
    const parsedProduct = Product.parseNormalizedProduct(payload);
    
    const query = {
      where: {
        name: parsedProduct.name,
        isVerified: true,
      }
    }

    return Product.findOneOrSave(query, parsedProduct);
  }

  static async findAndFetchByBarcode(
    barcode: BarcodeId,
    controller: AbortController
  ): Promise<Product[]> {
    const savedProducts = await this.findByBarcode(barcode);
    const hasNoSavedProducts = !savedProducts.length;
    const hasNoVerifiedProduct = !savedProducts.some(product => product.isVerified);
    
    if (hasNoSavedProducts || hasNoVerifiedProduct) {
      const fetchedProduct = await Product.searchApi.findOneByBarcode(barcode, controller);

      if (fetchedProduct) {
        const createdProduct = await Product.saveNormalizedProduct(fetchedProduct);

        return [createdProduct, ...savedProducts];
      }
    }

    return savedProducts;
  }

  static async findFavorites(userId: UserId): Promise<Product[]> {
    const productFavorites = await ProductFavorite.find({
      where: { userId },
      relations: ['product'],
      order: { id: 'DESC' }
    });

    const products = productFavorites.flatMap(productFavorite =>
      productFavorite.product ?? []
    );

    return products;
  }

  static findOwn(userId: UserId): Promise<Product[]> {
    return Product.find({
      where: { userId },
      order: { id: 'DESC' }
    });
  }

}

export type IProduct = EntityType<Product, 'portion'>;
export type IProductRequired = EntityRequired<IProduct,
  | 'name'
  | 'macro'
>;
export type IProductMerged = IProduct & IMealProduct;
export type ProductOrNormalizedProduct = Product | NormalizedProduct;