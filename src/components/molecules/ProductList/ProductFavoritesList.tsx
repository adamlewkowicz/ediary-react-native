import React from 'react';
import { ProductList, ProductListProps } from '.';
import { useProductFavorites } from '../../../hooks';

interface ProductFavoritesListProps extends Omit<ProductListProps, 'data'> {}

export const ProductFavoritesList = (props: ProductFavoritesListProps) => {
  const productFavorites = useProductFavorites();

  return (
    <ProductList
      data={productFavorites.data}
      isLoading={productFavorites.isLoading}
      onRefresh={productFavorites.refresh}
      onProductSelect={props.onProductSelect}
      a11yLabel="Lista ulubionych produktów"
    />
  );
}

export const ProductFavoritesListMemo = React.memo(ProductFavoritesList);