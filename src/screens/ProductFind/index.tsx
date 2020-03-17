import React, { useRef, useCallback } from 'react';
import styled from 'styled-components/native';
import { Product, ProductOrNormalizedProduct } from '../../database/entities';
import { ProductListItemMemo, Separator } from '../../components/ProductListItem';
import { InputSearcher } from '../../components/InputSearcher';
import { Block } from '../../components/Elements';
import { BarcodeButton } from '../../components/BarcodeButton';
import { useProductsSearch, useNavigationData } from '../../hooks';
import { useSelector, useDispatch } from 'react-redux';
import { Selectors, Actions } from '../../store';
import { FlatList, ToastAndroid } from 'react-native';
import { ProductFindScreenNavigationProps } from '../../navigation';
import { H3, ProductSearchItem, ButtonSecondaryArrow } from '../../_components';

interface ProductFindScreenProps {}

export const ProductFindScreen = (props: ProductFindScreenProps) => {
  const { params, navigate } = useNavigationData<ProductFindScreenNavigationProps>();
  const dispatch = useDispatch();
  const recentProducts = useSelector(Selectors.getProductHistory);
  const hasBeenPressed = useRef(false);
  const {
    state,
    isConnected,
    debouncedProductName,
    ...context
  } = useProductsSearch();
  const showRecentProducts = !state.isDirty;
  const productsSource = showRecentProducts ? recentProducts : state.products;

  function handleBarcodeScanNavigation() {
    navigate('BarcodeScan', {
      onBarcodeDetected(barcode) {
        navigate('ProductFind');
        context.updateBarcode(barcode);
      }
    });
  }

  function handleProductCreateNavigation() {
    navigate('ProductCreate', {
      barcode: state.barcode ?? undefined,
      name: debouncedProductName.trim(),
      onProductCreated(createdProduct) {
        context.addProduct(createdProduct);

        navigate('ProductFind');
        
        ToastAndroid.showWithGravity(
          `Utworzono produkt "${createdProduct.name}"`,
          ToastAndroid.SHORT,
          ToastAndroid.CENTER
        );

        dispatch(
          Actions.productHistoryRecentAdded([createdProduct])
        );
      }
    });
  }

  const handleItemPress = useCallback((product: ProductOrNormalizedProduct) => {
    if (params.onItemPress && !hasBeenPressed.current) {
      hasBeenPressed.current = true;

      const productResolver: ProductResolver = async () => {
        if (product instanceof Product) {
          return product;
        }
        return Product.saveNormalizedProduct(product);
      }

      params.onItemPress(productResolver);
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

  return (
    <Container>
      <Block space="space-between" align="center">
        <InputSearcher
          value={state.productName}
          placeholder="Nazwa produktu"
          accessibilityLabel="Nazwa szukanego produktu"
          onChangeText={context.updateProductName}
          isLoading={state.isSearching}
        />
        <BarcodeButton
          accessibilityLabel="Zeskanuj kod kreskowy"
          onPress={handleBarcodeScanNavigation}
        />
      </Block>
      <ProductsTitle>
        {showRecentProducts ? 'Ostatnio używane produkty:' : 'Znalezione produkty:'}
      </ProductsTitle>
      <RenderInfo />
      <ProductSearchItem />
      <FlatList
        data={productsSource}
        keyExtractor={productKeyExtractor}
        keyboardShouldPersistTaps="handled"
        ItemSeparatorComponent={Separator}
        renderItem={({ item: product }) => (
          <ProductListItemMemo
            product={product}
            onPress={handleItemPress}
            accessibilityLabel="Dodaj produkt do posiłku"
            accessibilityHint="Wraca na główną stronę i dodaje produkt do posiłku"
          />
        )}
      />
      <AddOwnProductButton
        onPress={handleProductCreateNavigation}
        accessibilityLabel="Dodaj własny produkt"  
      >
        Dodaj własny produkt
      </AddOwnProductButton>
    </Container>
  );
}

const Container = styled.View`
  padding: 20px 20px 60px 20px;
  margin-bottom: 10px;
`

const NotFoundInfo = styled.Text`
  margin-top: 25px;
  text-align: center;
  font-family: ${props => props.theme.fontWeight.regular};
  padding: 0 50px;
`

const ProductsTitle = styled(H3)`
  margin: 10px 0;
`

const AddOwnProductButton = styled(ButtonSecondaryArrow)`
  margin-top: 5px;
`

const productKeyExtractor = (product: ProductOrNormalizedProduct): string => {
  const productId = '_id' in product ? product._id : product.id;
  return String(productId);
}

export type ProductResolver = () => Promise<Product>;
