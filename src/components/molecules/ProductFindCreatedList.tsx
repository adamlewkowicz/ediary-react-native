import React from 'react';
import { useProductsCreated } from '../../hooks';
import { ProductFindList, ProductFindListProps } from './ProductFindList';

interface ProductFindCreatedListProps {
  onSelect: ProductFindListProps['onSelect']
}

export const ProductFindCreatedList = (props: ProductFindCreatedListProps) => {
  const productsCreated = useProductsCreated();
  console.log('render ProductFindCreatedList')

  return (
    <ProductFindList
      data={productsCreated.data}
      onSelect={props.onSelect}
      isLoading={productsCreated.isLoading}
      onRefresh={productsCreated.refresh}
    />
  );
}

export const ProductFindCreatedListMemo = React.memo(ProductFindCreatedList);