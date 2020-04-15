import {
  Entity,
  Column,
  Unique,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './User';
import { ProductId, UserId } from '../../types';
import { GenericEntity } from '../generics/GenericEntity';
import { Product } from './Product';

@Entity('product_favorites')
@Unique('productId_userId', ['productId', 'userId'])
export class ProductFavorite extends GenericEntity {

  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  productId!: ProductId;

  @Column()
  userId!: UserId;

  @ManyToOne(
    type => Product,
    product => product.favorites
  )
  @JoinColumn({ name: 'productId' })
  product?: Product;

  @ManyToOne(
    type => User,
    user => user.productFavorites
  )
  @JoinColumn({ name: 'userId' })
  user?: User;

  static async isFavorite(productId: ProductId, userId: UserId): Promise<boolean> {
    const productFavorite = await ProductFavorite.findOne({ productId, userId });

    if (productFavorite != null) {
      return true;
    }

    return false;
  }

}