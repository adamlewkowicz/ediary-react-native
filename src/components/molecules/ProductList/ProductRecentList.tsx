import React from 'react';
import { ProductList, ProductListProps } from '.';
import { useProductHistory, useIntl } from '../../../hooks';

interface ProductRecentListProps extends Omit<ProductListProps, 'data'> {}

export const ProductRecentList = (props: ProductRecentListProps) => {
  const productHistory = useProductHistory();
  const t = useIntl();

  return (
    <ProductList
      data={productHistory.data}
      onProductSelect={props.onProductSelect}
      isLoading={productHistory.isLoading}
      a11yLabel={t.productListRecent}
    />
  );
}

export const ProductRecentListMemo = React.memo(ProductRecentList);