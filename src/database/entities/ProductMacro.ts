import {
  Entity,
  Column,
  ManyToOne,
  JoinColumn,
  Unique,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Macro } from '../shared';
import { SqliteENUM } from '../decorators';
import { ProductId } from '../../types';
import { Product } from './Product';
import { EntityType } from '../types';
import { Optional } from 'utility-types';

@Entity('product_macro')
@Unique(['productId', 'unit'])
export class ProductMacro {

  @PrimaryGeneratedColumn()
  id!: number;

  @Column('text')
  @SqliteENUM(['g', 'ml'])
  unit!: 'g' | 'ml';

  @Column(type => Macro)
  data!: Macro;

  @Column()
  productId!: ProductId;

  @ManyToOne(
    type => Product,
    product => product.macro,
    { onDelete: 'CASCADE' }
  )
  @JoinColumn({ name: 'productId' })
  product?: Product[];

}

export type IProductMacro = EntityType<ProductMacro>;
export type IProductMacroOptional = Optional<IProductMacro, 'id' | 'productId'>;