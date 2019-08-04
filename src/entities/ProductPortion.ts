import { Entity, ManyToOne, Column, PrimaryColumn, OneToMany, JoinColumn } from 'typeorm/browser';
import { Product } from './Product';
import { PortionType } from './PortionType';
import { ProductId } from '../types';

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
  readonly product!: Product;

  @OneToMany(type => PortionType, portionType => portionType.productPortion)
  @JoinColumn({ name: 'type' })
  readonly portionType!: PortionType;

}