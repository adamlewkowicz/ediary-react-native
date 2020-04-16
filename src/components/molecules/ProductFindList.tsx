
import React from 'react';
import { FlatList } from 'react-native';
import { ProductOrNormalizedProduct, IProduct } from '../../database/entities';
import { ItemSeparator } from '../atoms';
import { ProductSearchItemMemo } from './ProductSearchItem';

export interface ProductFindListProps<T = ProductOrNormalizedProduct | IProduct> {
  data: T[]
  onSelect: (product: T) => void
}

export const ProductFindList = (props: ProductFindListProps) => (
  <FlatList
    data={props.data}
    renderItem={({ item: product }) => (
      <ProductSearchItemMemo
        product={product}
        onSelect={props.onSelect}
      />
    )}
    keyExtractor={productKeyExtractor}
    keyboardShouldPersistTaps="handled"
    ItemSeparatorComponent={ItemSeparator}
  />
);

const productKeyExtractor = (product: ProductOrNormalizedProduct): string => {
  const productId = '_id' in product ? product._id : product.id;
  return String(productId);
}