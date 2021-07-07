import React, { useEffect } from 'react';
import { useProductsCreated, useIntl } from '../../../hooks';
import { ProductList, ProductListProps } from '.';
import { Product } from '../../../database/entities';

interface ProductCreatedListProps extends Omit<ProductListProps, 'data'> {
  createdProduct: Product | null
}

const ProductCreatedList = (props: ProductCreatedListProps) => {
  const productsCreated = useProductsCreated();
  const t = useIntl();

  useEffect(() => {
    if (props.createdProduct !== null) {
      productsCreated.refresh();
    }
  }, [props.createdProduct]);

  return (
    <ProductList
      data={productsCreated.data}
      onProductSelect={props.onProductSelect}
      isLoading={productsCreated.isLoading}
      onRefresh={productsCreated.refresh}
      a11yLabel={t.productListCreated}
    />
  );
}

export const ProductCreatedListMemo = React.memo(ProductCreatedList);