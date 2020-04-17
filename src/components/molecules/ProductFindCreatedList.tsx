import React from 'react';
import { useProductsCreated } from '../../hooks';
import { ProductFindList, ProductFindListProps } from './ProductFindList';

interface ProductFindCreatedListProps extends Omit<ProductFindListProps, 'data'> {}

export const ProductFindCreatedList = (props: ProductFindCreatedListProps) => {
  const productsCreated = useProductsCreated();
  console.log('render ProductFindCreatedList')

  return (
    <ProductFindList
      data={productsCreated.data}
      onProductSelect={props.onProductSelect}
      isLoading={productsCreated.isLoading}
      onRefresh={productsCreated.refresh}
    />
  );
}

export const ProductFindCreatedListMemo = React.memo(ProductFindCreatedList);