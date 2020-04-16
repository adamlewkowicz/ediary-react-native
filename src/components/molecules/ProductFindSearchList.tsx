import React from 'react';
import { ProductFindList, ProductFindListProps } from './ProductFindList';
import { ProductsSearchState } from '../../hooks';
import styled from 'styled-components/native';
import { TextPrimary, H3 } from '../atoms';

interface ProductFindSearchListProps {
  state: ProductsSearchState
  isConnected: boolean
  productSearchName: string
  onSelect: ProductFindListProps['onSelect']
}

export const ProductFindSearchList = (props: ProductFindSearchListProps) => {
  function RenderInfo() {
    const {
      isSearching,
      products,
      barcode,
      isTyping,
    } = props.state;
    const isBusy = isSearching || isTyping;
    const isProductsNotEmpty = products.length > 0;
    const isProductNameNotTouched = props.productSearchName.length === 0;
    const hasNotBeenSearching = isProductNameNotTouched && barcode === null;

    if (isBusy || isProductsNotEmpty || hasNotBeenSearching) {
      return null;
    }

    const notFoundMessage = barcode !== null
      ? `z podanym kodem kreskowym: ${barcode}`
      : `o podanej nazwie: ${props.productSearchName}`;

    return (
      <>
        <NotFoundInfo>
          Nie znaleziono produktów {'\n'}
          {notFoundMessage}
        </NotFoundInfo>
        {!props.isConnected && (
          <NotFoundInfo>
            Aby wyszukiwać więcej produktów, przejdź do trybu online.
          </NotFoundInfo>
        )}
      </>
    );
  }

  return (
    <>
      <RenderInfo />    
      <ProductFindList
        data={props.state.products}
        onSelect={props.onSelect}
        isLoading={props.state.isSearching}
      />
    </>
  );
}

const NotFoundInfo = styled(TextPrimary)`
  text-align: center;
  margin-top: ${props => props.theme.spacing.base};
  padding: ${props => props.theme.spacing.largeHorizontal};
`

export const ProductFindSearchListMemo = React.memo(ProductFindSearchList);