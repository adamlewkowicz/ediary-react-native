import { BaseResponse } from './base';
import { Product } from '../types';

export interface ResponseEan extends BaseResponse {
  product: Product
}