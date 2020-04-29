import React, { useEffect } from 'react';
import { useProductsCreated } from '../../../hooks';
import { ProductList, ProductListProps } from '.';

interface ProductCreatedListProps extends Omit<ProductListProps, 'data'> {
  isRefreshRequested: boolean
}

const ProductCreatedList = (props: ProductCreatedListProps) => {
  const productsCreated = useProductsCreated();

  useEffect(() => {
    if (props.isRefreshRequested) {
      productsCreated.refresh();
    }
  }, [props.isRefreshRequested]);

  return (
    <ProductList
      data={productsCreated.data}
      onProductSelect={props.onProductSelect}
      isLoading={productsCreated.isLoading}
      onRefresh={productsCreated.refresh}
      onProductAction={props.onProductAction}
    />
  );
}

export const ProductCreatedListMemo = React.memo(ProductCreatedList);