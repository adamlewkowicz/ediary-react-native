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
import { ProductFindFavoritesList } from '../../components/molecules/ProductFindFavoritesList';
import { ProductFindCreatedList } from '../../components/molecules/ProductFindCreatedList';
import { ProductFindRecentList } from '../../components/molecules/ProductFindRecentList';
import { ProductFindSearchList } from '../../components/molecules/ProductFindSearchList';

interface ProductFindScreenProps {}

export const ProductFindScreen = (props: ProductFindScreenProps) => {
  const { params, navigate, navigation } = useNavigationData<ProductFindScreenNavigationProps>();
  const productHistory = useProductHistory();
  const hasBeenPressed = useRef(false);
  const {
    state,
    isConnected,
    debouncedProductName,
    ...productSearch
  } = useProductsSearch();
  const [activeTabIndex, setActiveTabIndex] = useState(0);

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
        productHistory.addProduct(createdProduct);
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
  }, [params]);

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

  const handleChangeText = (text: string) => {
    if (activeTabIndex !== 1) {
      setActiveTabIndex(1);
    }
    productSearch.updateProductName(text);
  }

  return (
    <Container>
      <SearchContainer>
        <InputSearcher
          value={state.productName}
          placeholder="Nazwa produktu"
          accessibilityLabel="Nazwa szukanego produktu"
          accessibilityRole="search"
          onChangeText={handleChangeText}
          isLoading={state.isSearching}
        />
        <BarcodeButton
          accessibilityLabel="Zeskanuj kod kreskowy"
          onPress={handleBarcodeScan}
        />
      </SearchContainer>
      <TabContainer
        activeIndex={activeTabIndex}
        onIndexChange={setActiveTabIndex}
        routes={{
          'Ostatnio używane': () => (
            <ProductFindRecentList onSelect={handleProductSelect} />
          ),
          'Znalezione': () => (
            <ProductFindSearchList
              onSelect={handleProductSelect}
              state={state}
              isConnected={isConnected}
              productSearchName={debouncedProductName}
            />
          ),
          'Ulubione': () => (
            <ProductFindFavoritesList onSelect={handleProductSelect} />
          ),
          'Utworzone': () => (
            <ProductFindCreatedList onSelect={handleProductSelect} />
          )
        }}
      />
    </Container>
  );
}

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