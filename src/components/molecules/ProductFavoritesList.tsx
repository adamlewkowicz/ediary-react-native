import React from 'react';
import { ProductList, ProductListProps } from './ProductList';
import { useProductFavorites } from '../../hooks';

interface ProductFavoritesListProps extends Omit<ProductListProps, 'data'> {}

export const ProductFavoritesList = (props: ProductFavoritesListProps) => {
  const productFavorites = useProductFavorites();
  console.log('render ProductFavoritesList')

  return (
    <ProductList
      data={productFavorites.data}
      isLoading={productFavorites.isLoading}
      onRefresh={productFavorites.refresh}
      onProductSelect={props.onProductSelect}
    />
  );
}

export const ProductFavoritesListMemo = React.memo(ProductFavoritesList);