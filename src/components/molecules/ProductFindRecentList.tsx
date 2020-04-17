import React from 'react';
import { ProductFindList, ProductFindListProps } from './ProductFindList';
import { useProductHistory } from '../../hooks';

interface ProductFindRecentListProps extends Omit<ProductFindListProps, 'data'> {}

export const ProductFindRecentList = (props: ProductFindRecentListProps) => {
  console.log('render ProductFindRecentList')
  const productHistory = useProductHistory();

  return (
    <ProductFindList
      data={productHistory.data}
      onProductSelect={props.onProductSelect}
      isLoading={!productHistory.isAfterFirstFetch}
    />
  );
}

export const ProductFindRecentListMemo = React.memo(ProductFindRecentList);