import React from 'react';
import { ProductFindList, ProductFindListProps } from './ProductFindList';
import { useProductFavorites } from '../../hooks';

interface ProductFindFavoritesListProps {
  onSelect: ProductFindListProps['onSelect']
}

export const ProductFindFavoritesList = (props: ProductFindFavoritesListProps) => {
  const productFavorites = useProductFavorites();

  return (
    <ProductFindList
      data={productFavorites.data}
      onSelect={props.onSelect}
    />
  );
}