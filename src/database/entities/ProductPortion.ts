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
import { PortionType } from './Lexical';

@Entity('product_portion')
export class ProductPortion {

  @PrimaryColumn()
  productId!: ProductId;

  @PrimaryColumn()
  type!: PortionType['value'];

  @Column()
  value!: number;

  @ManyToOne(
    type => Product,
    product => product.portions,
    { onDelete: 'CASCADE' }
  )
  @JoinColumn({ name: 'productId' })
  product!: Product;

  @OneToOne(
    type => PortionType,
    { cascade: true }
  )
  @JoinColumn({ name: 'type' })
  portionType?: PortionType;

}