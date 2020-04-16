
import React from 'react';
import { FlatList, RefreshControl as NativeRefreshControl } from 'react-native';
import { ProductOrNormalizedProduct, IProduct } from '../../database/entities';
import { ItemSeparator } from '../atoms';
import { ProductSearchItemMemo } from './ProductSearchItem';
import styled from 'styled-components/native';

export interface ProductFindListProps<T = ProductOrNormalizedProduct | IProduct> {
  data: T[]
  onSelect: (product: T) => void
  isLoading?: boolean
  onRefresh?: () => void
}

export const ProductFindList = (props: ProductFindListProps) => (
  <FlatList
    data={props.data}
    keyExtractor={productKeyExtractor}
    keyboardShouldPersistTaps="handled"
    ItemSeparatorComponent={ItemSeparator}
    renderItem={({ item: product }) => (
      <ProductSearchItemMemo
        product={product}
        onSelect={props.onSelect}
      />
    )}
    refreshControl={(
      <RefreshControl
        refreshing={props.isLoading ?? false}
        onRefresh={() => props.onRefresh?.()}
      />
    )}
  />
);

const RefreshControl = styled(NativeRefreshControl).attrs(props => ({
  colors: [props.theme.color.highlight],
  tintColor: props.theme.color.highlight
}))``

const productKeyExtractor = (product: ProductOrNormalizedProduct): string => {
  const productId = '_id' in product ? product._id : product.id;
  return String(productId);
}