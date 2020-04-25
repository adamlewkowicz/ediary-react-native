
import React from 'react';
import { FlatList, RefreshControl as NativeRefreshControl } from 'react-native';
import { ProductOrNormalizedProduct } from '../../database/entities';
import { ItemSeparator } from '../atoms';
import { ProductSearchItemMemo } from './ProductSearchItem';
import styled from 'styled-components/native';

export interface ProductListProps<T = ProductOrNormalizedProduct> {
  data: T[]
  onProductSelect: (product: T) => void
  isLoading?: boolean
  onRefresh?: () => void
  a11yLabel?: string
}

export const ProductList = (props: ProductListProps) => (
  <FlatList
    data={props.data}
    accessibilityState={{ busy: props.isLoading }}
    keyExtractor={productKeyExtractor}
    keyboardShouldPersistTaps="handled"
    ItemSeparatorComponent={ItemSeparator}
    accessibilityLabel={props.a11yLabel}
    renderItem={({ item: product }) => (
      <ProductSearchItemMemo
        product={product}
        onSelect={props.onProductSelect}
      />
    )}
    refreshControl={(
      <RefreshControl
        refreshing={props.isLoading ?? false}
        onRefresh={() => props.onRefresh?.()}
        accessibilityLabel="Trwa ładowanie produktów"
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