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
      onProductAction={props.onProductAction}
      isLoading={productHistory.isLoading}
      onRefresh={productHistory.refresh}
      a11yLabel="Lista ostatnio używanych produktów"
    />
  );
}

export const ProductRecentListMemo = React.memo(ProductRecentList);