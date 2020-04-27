import React from 'react';
import { ProductList, ProductListProps } from '.';
import { useProductHistory } from '../../../hooks';

interface ProductRecentListProps extends Omit<ProductListProps, 'data'> {}

export const ProductRecentList = (props: ProductRecentListProps) => {
  const productHistory = useProductHistory();

  return (
    <ProductList
      data={productHistory.data}
      onProductSelect={props.onProductSelect}
      isLoading={productHistory.isLoading}
      a11yLabel="Lista ostatnio używanych produktów"
    />
  );
}

export const ProductRecentListMemo = React.memo(ProductRecentList);