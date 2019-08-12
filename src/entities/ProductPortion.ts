import {
  Entity,
  ManyToOne,
  Column,
  PrimaryColumn,
  JoinColumn,
} from 'typeorm/browser';
import { Product } from './Product';
import { ProductId } from '../types';
import { ManyToMany } from 'typeorm';
import { PortionType } from './Lexical';

@Entity()
export class ProductPortion {

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

  @ManyToMany(type => PortionType)
  @JoinColumn({ name: 'type' })
  portionType!: PortionType;

}