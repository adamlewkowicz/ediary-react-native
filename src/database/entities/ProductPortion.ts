import {
  Entity,
  ManyToOne,
  Column,
  PrimaryColumn,
  JoinColumn,
  Unique,
} from 'typeorm';
import { Product } from './Product';
import { ProductId } from '../../types';
import { EntityType } from '../types';
import { GenericEntity } from '../generics/GenericEntity';

@Entity('product_portions')
@Unique<ProductPortion>(['productId', 'type'])
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
  product?: Product;

}

export type IProductPortion = EntityType<ProductPortion>;