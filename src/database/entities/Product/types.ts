import { ProductId } from '../../../types';
import { Product } from '.';

export interface FindMostProductIdsResult {
  count: number
  productId: ProductId
}

export interface FindMostUsedResult extends FindMostProductIdsResult {
  product: Product
}