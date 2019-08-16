import {
  Entity,
  ManyToOne,
  Column,
  PrimaryColumn,
  JoinColumn,
} from 'typeorm';
import { Product } from './Product';
import { ProductId } from '../../types';
import { GenericEntity } from './Generic';
import { EntityType } from '../types';

@Entity('product_portions')
export class ProductPortion extends GenericEntity {

  @PrimaryColumn()
  productId!: ProductId;

  @PrimaryColumn()
  type!: string;

  @Column()
  value!: number;

  @ManyToOne(
    type => Product,
    product => product.portions,
    { onDelete: 'CASCADE' }
  )
  @JoinColumn({ name: 'productId' })
  product!: Product;

}

export type IProductPortion = EntityType<ProductPortion>;