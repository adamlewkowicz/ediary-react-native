import React from 'react';
import { useProductsCreated } from '../../hooks';
import { ProductList, ProductListProps } from './ProductList';

interface ProductCreatedListProps extends Omit<ProductListProps, 'data'> {}

const ProductCreatedList = (props: ProductCreatedListProps) => {
  const productsCreated = useProductsCreated();
  console.log('render ProductCreatedList')

  return (
    <ProductList
      data={productsCreated.data}
      onProductSelect={props.onProductSelect}
      isLoading={productsCreated.isLoading}
      onRefresh={productsCreated.refresh}
    />
  );
}

export const ProductCreatedListMemo = React.memo(ProductCreatedList);