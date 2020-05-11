import React, { useEffect } from 'react';
import { useProductsCreated } from '../../../hooks';
import { ProductList, ProductListProps } from '.';
import { useImperativeHandle } from 'react';

export interface ProductCreatedListRef {
  refresh: () => void
}

interface ProductCreatedListProps extends Omit<ProductListProps, 'data'> {}

const ProductCreatedList = React.forwardRef<ProductCreatedListRef, ProductCreatedListProps>((
  props: ProductCreatedListProps,
  ref
) => {
  const productsCreated = useProductsCreated();

  useImperativeHandle(ref, () => ({
    refresh: productsCreated.refresh
  }));

  return (
    <ProductList
      data={productsCreated.data}
      onProductSelect={props.onProductSelect}
      isLoading={productsCreated.isLoading}
      onRefresh={productsCreated.refresh}
      onProductAction={props.onProductAction}
    />
  );
});

export const ProductCreatedListMemo = React.memo(ProductCreatedList);