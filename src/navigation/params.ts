import { Product } from '../database/entities';
import { Screen } from '../types';

export type ProductFindOnItemPress = ((product: Product) => void) | undefined;
export type ProductFindParams = {
  onItemPress?: ProductFindOnItemPress
}

export type ScreenParamsMap = {
  ProductFind: ProductFindParams
}

export type ScreenParams<S extends Screen> = ScreenParamsMap[S];