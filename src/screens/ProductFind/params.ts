import { ProductResolver } from '.';

export type ProductFindParams = {
  onItemPress?: (productResolver: ProductResolver) => void;
}