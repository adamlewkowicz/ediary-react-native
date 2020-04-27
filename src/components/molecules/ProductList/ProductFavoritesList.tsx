import React from 'react';
import { ProductList, ProductListProps } from '.';
import { useProductFavorites, useIntl } from '../../../hooks';

interface ProductFavoritesListProps extends Omit<ProductListProps, 'data'> {}

export const ProductFavoritesList = (props: ProductFavoritesListProps) => {
  const productFavorites = useProductFavorites();
  const t = useIntl();

  return (
    <ProductList
      data={productFavorites.data}
      isLoading={productFavorites.isLoading}
      onRefresh={productFavorites.refresh}
      onProductSelect={props.onProductSelect}
      a11yLabel={t.productListFavorite}
    />
  );
}

export const ProductFavoritesListMemo = React.memo(ProductFavoritesList);