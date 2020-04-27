import React from 'react';
import { ProductList, ProductListProps } from '.';
import { useProductSearch } from '../../../hooks';
import styled from 'styled-components/native';
import { TextPrimary } from '../../atoms';
import { BarcodeId } from '../../../types';

interface ProductSearchListProps extends Omit<ProductListProps, 'data'> {
  productName: string
  barcode: null | BarcodeId
}

export const ProductSearchList = (props: ProductSearchListProps) => {
  const { isConnected, isLoading, products } = useProductSearch(props.productName, props.barcode);
  
  function RenderInfo() {
    const isProductsNotEmpty = products.length > 0;
    const isProductNameNotTouched = props.productName.length === 0;
    const hasNotBeenSearching = isProductNameNotTouched && props.barcode === null;

    if (isLoading || isProductsNotEmpty || hasNotBeenSearching) {
      return null;
    }

    const notFoundMessage = props.barcode !== null
      ? `z podanym kodem kreskowym: ${props.barcode}`
      : `o podanej nazwie: ${props.productName}`;

    return (
      <>
        <NotFoundInfo>
          Nie znaleziono produktów {'\n'}
          {notFoundMessage}
        </NotFoundInfo>
        {!isConnected && (
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
      <ProductList
        data={products}
        isLoading={isLoading}
        onProductSelect={props.onProductSelect}
        a11yLabel="Lista znalezionych produktów"
      />
    </>
  );
}

const NotFoundInfo = styled(TextPrimary)`
  text-align: center;
  margin-top: ${props => props.theme.spacing.base};
  padding: ${props => props.theme.spacing.largeHorizontal};
`

export const ProductSearchListMemo = React.memo(ProductSearchList);