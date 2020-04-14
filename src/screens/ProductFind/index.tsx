import React, { useRef, useCallback } from 'react';
import styled from 'styled-components/native';
import { Product, ProductOrNormalizedProduct } from '../../database/entities';
import { useProductsSearch, useNavigationData, useProductHistory } from '../../hooks';
import { FlatList, ListRenderItem, FlatListProps } from 'react-native';
import { ProductFindScreenNavigationProps } from '../../navigation';
import {
  H3,
  ButtonSecondaryArrow,
  ProductSearchItemMemo,
  ItemSeparator,
  InputSearcher,
  BarcodeButton,
  TextPrimary,
} from '../../components';
import * as Utils from '../../utils';
import { TabContainer } from '../../components/atoms/Tab';
import { Tab } from '../../components/atoms/Tab/Tab';

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

  const showProductHistory = !state.isDirty;

  const productSource: ProductOrNormalizedProduct[] = showProductHistory
    ? productHistory.data
    : state.products;

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

  function RenderInfo() {
    const {
      isSearching,
      products,
      barcode,
      isTyping,
    } = state;
    const isBusy = isSearching || isTyping;
    const isProductsNotEmpty = products.length > 0;
    const isProductNameNotTouched = debouncedProductName.length === 0;
    const hasNotBeenSearching = isProductNameNotTouched && barcode === null;

    if (isBusy || isProductsNotEmpty || hasNotBeenSearching) {
      return null;
    }

    const notFoundMessage = barcode !== null
      ? `z podanym kodem kreskowym: ${barcode}`
      : `o podanej nazwie: ${debouncedProductName}`;

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

  const renderItem: ListRenderItem<ProductOrNormalizedProduct> = ({ item: product }) => (
    <ProductSearchItemMemo
      product={product}
      onSelect={handleProductSelect}
    />
  );

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
        />
        <BarcodeButton
          accessibilityLabel="Zeskanuj kod kreskowy"
          onPress={handleBarcodeScan}
        />
      </SearchContainer>
      <TabContainer
        routes={{
          'Ostatnio używane': () => (
            <>
              <RenderInfo />
              <FlatList
                data={productHistory.data}
                renderItem={renderItem}
                {...listProps}
              />
            </>
          ),
          'Znalezione': () => (
            <FlatList
              data={state.products}
              renderItem={renderItem}
              {...listProps}
            />
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

const NotFoundInfo = styled(TextPrimary)`
  text-align: center;
  margin-top: ${props => props.theme.spacing.base};
  padding: ${props => props.theme.spacing.largeHorizontal};
`

const ProductsTitle = styled(H3)`
  margin: ${props => props.theme.spacing.smallXMicroVertical};
  padding: ${props => props.theme.spacing.smallHorizontal};
`

const AddOwnProductButton = styled(ButtonSecondaryArrow)`
  margin-right: ${props => props.theme.spacing.micro};
`

const productKeyExtractor = (product: ProductOrNormalizedProduct): string => {
  const productId = '_id' in product ? product._id : product.id;
  return String(productId);
}

const listProps: Partial<FlatListProps<ProductOrNormalizedProduct>> = {
  keyExtractor: productKeyExtractor,
  keyboardShouldPersistTaps: "handled",
  ItemSeparatorComponent: ItemSeparator,
}

export type ProductResolver = () => Promise<Product>;