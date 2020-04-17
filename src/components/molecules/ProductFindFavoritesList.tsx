import React from 'react';
import { ProductFindList, ProductFindListProps } from './ProductFindList';
import { useProductFavorites } from '../../hooks';

interface ProductFindFavoritesListProps extends Omit<ProductFindListProps, 'data'> {}

export const ProductFindFavoritesList = (props: ProductFindFavoritesListProps) => {
  const productFavorites = useProductFavorites();
  console.log('render ProductFindFavoritesList')

  return (
    <ProductFindList
      data={productFavorites.data}
      isLoading={productFavorites.isLoading}
      onRefresh={productFavorites.refresh}
      onProductSelect={props.onProductSelect}
    />
  );
}

export const ProductFindFavoritesListMemo = React.memo(ProductFindFavoritesList);