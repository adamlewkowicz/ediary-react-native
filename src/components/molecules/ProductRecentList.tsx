import React from 'react';
import { ProductList, ProductListProps } from './ProductList';
import { useProductHistory } from '../../hooks';

interface ProductRecentListProps extends Omit<ProductListProps, 'data'> {}

export const ProductRecentList = (props: ProductRecentListProps) => {
  console.log('render ProductRecentList')
  const productHistory = useProductHistory();

  return (
    <ProductList
      data={productHistory.data}
      onProductSelect={props.onProductSelect}
      isLoading={!productHistory.isAfterFirstFetch}
    />
  );
}

export const ProductRecentListMemo = React.memo(ProductRecentList);