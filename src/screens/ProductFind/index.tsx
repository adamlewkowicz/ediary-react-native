import React, { useRef, useCallback, useState } from 'react';
import styled from 'styled-components/native';
import { Product, ProductOrNormalizedProduct } from '../../database/entities';
import { useProductsSearch, useNavigationData, useProductHistory } from '../../hooks';
import { ProductFindScreenNavigationProps } from '../../navigation';
import {
  ButtonSecondaryArrow,
  InputSearcher,
  BarcodeButton,
} from '../../components';
import * as Utils from '../../utils';
import { TabContainer } from '../../components/atoms/Tab';
import { ProductFindFavoritesList, ProductFindFavoritesListMemo } from '../../components/molecules/ProductFindFavoritesList';
import { ProductFindCreatedList, ProductFindCreatedListMemo } from '../../components/molecules/ProductFindCreatedList';
import { ProductFindRecentList, ProductFindRecentListMemo } from '../../components/molecules/ProductFindRecentList';
import { ProductFindSearchList, ProductFindSearchListMemo } from '../../components/molecules/ProductFindSearchList';
import { ValueOf } from '../../types';

export const ProductFindScreen = () => {
  const { params, navigate, navigation } = useNavigationData<ProductFindScreenNavigationProps>();
  // const productHistory = useProductHistory();
  const hasBeenPressed = useRef(false);
  const {
    state,
    isConnected,
    debouncedProductName,
    ...productSearch
  } = useProductsSearch();
  const [activeRoute, setActiveRoute] = useState<TabRoute>(TAB_ROUTE.recent);

  const showProductHistory = !state.isDirty;

  function handleBarcodeScan() {
    navigate('BarcodeScan', {
      onBarcodeDetected(barcode) {
        navigate('ProductFind');
        productSearch.updateBarcode(barcode);
      }
    });
  }

  function handleProductCreate() {
    navigate('ProductCreate', {
      barcode: state.barcode ?? undefined,
      name: debouncedProductName.trim(),
      onProductCreated(createdProduct) {
        productSearch.addProduct(createdProduct);

        navigate('ProductFind');

        Utils.toastCenter(`Utworzono produkt "${createdProduct.name}"`);
        // productHistory.addProduct(createdProduct);
      }
    });
  }

  const handleProductSelect = useCallback((product: ProductOrNormalizedProduct) => {
    if (params.onProductSelected && !hasBeenPressed.current) {
      hasBeenPressed.current = true;

      const productResolver: ProductResolver = async () => {
        if (product instanceof Product) {
          return product;
        }
        return Product.saveNormalizedProduct(product);
      }

      params.onProductSelected(productResolver, product.portion);
    }
  }, [params.onProductSelected]);

  navigation.setOptions({
    headerRight: () => (
      <AddOwnProductButton
        onPress={handleProductCreate}
        accessibilityLabel="Stwórz własny produkt"
        accessibilityHint="Przechodzi do tworzenia własnego produktu"
        role="link"
      >
        Stwórz
      </AddOwnProductButton>
    )
  });

  const handleInputFocus = (): void => {
    if (activeRoute !== TAB_ROUTE.search) {
      setActiveRoute(TAB_ROUTE.search);
    }
  }

  return (
    <Container>
      <SearchContainer>
        <InputSearcher
          value={state.productName}
          placeholder="Nazwa produktu"
          accessibilityLabel="Nazwa szukanego produktu"
          accessibilityRole="search"
          onChangeText={productSearch.updateProductName}
          isLoading={state.isSearching}
          onFocus={handleInputFocus}
        />
        <BarcodeButton
          accessibilityLabel="Zeskanuj kod kreskowy"
          onPress={handleBarcodeScan}
        />
      </SearchContainer>
      <TabContainer
        activeRoute={activeRoute}
        onRouteChange={setActiveRoute}
        routes={{
          [TAB_ROUTE.recent]: <ProductFindRecentListMemo onSelect={handleProductSelect} />,
          [TAB_ROUTE.favorite]: <ProductFindFavoritesListMemo onSelect={handleProductSelect} />,
          [TAB_ROUTE.created]: <ProductFindCreatedListMemo onSelect={handleProductSelect} />,
          [TAB_ROUTE.search]: (
            <ProductFindSearchListMemo
              onSelect={handleProductSelect}
              state={state}
              isConnected={isConnected}
              productSearchName={debouncedProductName}
            />
          )
        }}
      />
    </Container>
  );
}

const TAB_ROUTE = {
  recent: 'Ostatnio używane',
  favorite: 'Ulubione',
  created: 'Utworzone',
  search: 'Znalezione',
} as const;

type TabRoute = ValueOf<typeof TAB_ROUTE>;

const SearchContainer = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: ${props => props.theme.spacing.smallHorizontal};
`

const Container = styled.View`
  flex: 1;
  padding-top: ${props => props.theme.spacing.small};
`

const AddOwnProductButton = styled(ButtonSecondaryArrow)`
  margin-right: ${props => props.theme.spacing.micro};
`

export type ProductResolver = () => Promise<Product>;