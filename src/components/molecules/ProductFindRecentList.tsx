import React from 'react';
import { ProductFindList, ProductFindListProps } from './ProductFindList';
import { useProductHistory } from '../../hooks';

interface ProductFindRecentListProps {
  onSelect: ProductFindListProps['onSelect']
}

export const ProductFindRecentList = (props: ProductFindRecentListProps) => {
  console.log('render ProductFindRecentList')
  const productHistory = useProductHistory();

  return (
    <ProductFindList
      data={productHistory.data}
      onSelect={props.onSelect}
      isLoading={!productHistory.isAfterFirstFetch}
    />
  );
}

export const ProductFindRecentListMemo = React.memo(ProductFindRecentList);