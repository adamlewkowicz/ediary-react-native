import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  Column,
} from 'typeorm';
import { Product } from './Product';

@Entity('product_images')
export class ProductImage {

  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  url!: string;

  @ManyToOne(
    type => Product,
    product => product.images,
    { onDelete: 'CASCADE' }
  )
  product?: Product;

}