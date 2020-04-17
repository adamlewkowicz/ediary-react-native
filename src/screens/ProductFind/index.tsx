import React, { useRef, useCallback, useState } from 'react';
import styled from 'styled-components/native';
import { Product, ProductOrNormalizedProduct } from '../../database/entities';
import {
  useNavigationData,
  useDebouncedValue,
} from '../../hooks';
import { ProductFindScreenNavigationProps } from '../../navigation';
import {
  ButtonSecondaryArrow,
  InputSearcher,
  BarcodeButton,
  ProductRecentListMemo,
  ProductFavoritesListMemo,
  ProductCreatedListMemo,
  ProductSearchListMemo,
} from '../../components';
import * as Utils from '../../utils';
import { TabContainer } from '../../components/atoms/Tab';
import { ValueOf, BarcodeId } from '../../types';

export const ProductFindScreen = () => {
  const { params, navigate, navigation } = useNavigationData<ProductFindScreenNavigationProps>();
  const hasBeenPressed = useRef(false);
  const [activeRoute, setActiveRoute] = useState<TabRoute>(TAB_ROUTE.recent);
  const [barcode, setBarcode] = useState<BarcodeId | null>(null);
  const [productName, setProductName] = useState('');
  const [createdProduct, setCreatedProduct] = useState<Product | null>(null);
  const productNameDebounced = useDebouncedValue(productName);

  function handleBarcodeScan() {
    navigate('BarcodeScan', {
      onBarcodeDetected(barcode) {
        navigate('ProductFind');

        setBarcode(barcode);
      }
    });
  }

  function handleProductCreate() {
    navigate('ProductCreate', {
      barcode: barcode ?? undefined,
      name: productNameDebounced.trim(),
      onProductCreated(createdProduct) {
        navigate('ProductFind');
        setCreatedProduct(createdProduct);
        setActiveRoute(TAB_ROUTE.created);

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
          value={productName}
          onChangeText={setProductName}
          placeholder="Nazwa produktu"
          accessibilityLabel="Nazwa szukanego produktu"
          accessibilityRole="search"
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
          [TAB_ROUTE.recent]: (
            <ProductRecentListMemo onProductSelect={handleProductSelect} />
          ),
          [TAB_ROUTE.favorite]: (
            <ProductFavoritesListMemo onProductSelect={handleProductSelect} />
          ),
          [TAB_ROUTE.created]: (
            <ProductCreatedListMemo
              onProductSelect={handleProductSelect}
              createdProduct={createdProduct}
            />
          ),
          [TAB_ROUTE.search]: (
            <ProductSearchListMemo
              onProductSelect={handleProductSelect}
              productName={productNameDebounced}
              barcode={barcode}
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