import { Product } from '../../database/entities';

export type ProductFindOnItemPress = ((product: Product) => void) | undefined;
export type ProductFindParams = {
  onItemPress?: ProductFindOnItemPress
}