import { Entity, OneToMany, PrimaryColumn } from 'typeorm/browser';
import { ProductPortion } from './ProductPortion';

@Entity()
export class PortionType {

  @PrimaryColumn()
  value!: string;

  @OneToMany(type => ProductPortion, productPortion => productPortion.portionType)
  productPortion!: ProductPortion[];

}