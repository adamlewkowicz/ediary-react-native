import {
  Entity,
  ManyToOne,
  Column,
  PrimaryColumn,
  JoinColumn,
  OneToOne,
} from 'typeorm';
import { Product } from './Product';
import { ProductId } from '../../types';
import { UnitType } from './Lexical';

@Entity('product_portion')
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

  @OneToOne(type => UnitType)
  @JoinColumn({ name: 'type' })
  unitType!: UnitType;

}