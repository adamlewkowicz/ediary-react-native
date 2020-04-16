import React from 'react';
import { ProductFindList, ProductFindListProps } from './ProductFindList';
import { useProductHistory } from '../../hooks';

interface ProductFindRecentListProps {
  onSelect: ProductFindListProps['onSelect']
}

export const ProductFindRecentList = (props: ProductFindRecentListProps) => {
  const productHistory = useProductHistory();

  return (
    <ProductFindList
      data={productHistory.data}
      onSelect={props.onSelect}
    />
  );
}