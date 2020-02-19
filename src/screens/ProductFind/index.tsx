import React, { useRef, useReducer } from 'react';
import styled from 'styled-components/native';
import { Product, ProductOrNormalizedProduct } from '../../database/entities';
import { ProductListItemMemo, Separator } from '../../components/ProductListItem';
import { InputSearcher } from '../../components/InputSearcher';
import { SectionList } from 'react-navigation';
import { Block, Title } from '../../components/Elements';
import { BarcodeButton } from '../../components/BarcodeButton';
import { Button } from '../../components/Button';
import { useConnected, useIdleStatus, useNavigate, useTypingValue } from '../../hooks';
import { useSelector } from 'react-redux';
import { StoreState } from '../../store';
import { ActivityIndicator, Text } from 'react-native';
import { ProductFindParams } from './params';
import { useNavigationParams } from '../../hooks/useNavigationParams';
import { useMountedEffect } from '../../hooks/useMountedEffect';
import { productFindReducer, initialState } from './reducer';

interface ProductFindProps {}

let timeout: NodeJS.Timeout;

export const ProductFind = (props: ProductFindProps) => {
  const [state, dispatch] = useReducer(productFindReducer, initialState);
  const params = useNavigationParams<ProductFindParams>();
  const isConnected = useConnected();
  const recentProducts = useSelector((state: StoreState) => state.productHistory);
  const hasBeenPressed = useRef(false);
  const isIdle = useIdleStatus();
  const navigate = useNavigate();
  const _isTyping = useRef(false); // Additional mutable helper

  const handleProductNameUpdate = (productName: string): void => {
    clearTimeout(timeout);

    _isTyping.current = true;
    dispatch({ type: 'PRODUCT_NAME_UPDATED', payload: productName });

    timeout = setTimeout(
      () => {
        _isTyping.current = false;
        dispatch({ type: 'TYPING_FINISHED' });
      },
      800
    );
  }

  useMountedEffect(() => {
    const { productName, isTyping } = state;
    console.log({ productName, _isTyping, isTyping })
    if (_isTyping.current) return;

    dispatch({ type: 'PRODUCTS_SEARCH_STARTED' });

    const controller = new AbortController();
    const trimmedName = state.productName.trim();
    const methodName = isConnected ? 'findAndFetchByNameLike' : 'findByNameLike';

    Product[methodName](trimmedName, controller)
      .then(foundProducts => {
        if (_isTyping.current) return;
        dispatch({ type: 'PRODUCTS_UPDATED', payload: foundProducts });
      })
      .catch(error => {
        if (error.name === 'AbortError') {
          // pass
        } else {
          // TODO: Error handling
        }
      })
      .finally(() => dispatch({ type: 'PRODUCTS_SEARCH_FINISHED' }));

    return () => controller.abort();
    // https://github.com/alk831/ediary-react-native/pull/40#issuecomment-588157493
  }, [state.isTyping, state.productName, isConnected]);

  function handleBarcodeScanNavigation() {
    navigate('BarcodeScan', {
      async onBarcodeDetected(barcode) {
        dispatch({ type: 'BARCODE_SEARCH_STARTED' });
        navigate('ProductFind');

        const methodName = isConnected ? 'findAndFetchByBarcode' : 'findByBarcode';
        const foundProducts = await Product[methodName](barcode);

        dispatch({ type: 'BARCODE_SEARCH_FINISHED', payload: { barcode, foundProducts }});
      }
    });
  }

  function handleProductCreateNavigation() {
    navigate('ProductCreate', {
      barcode: state.barcode ?? undefined,
      name: state.productName.trim(),
      onProductCreated(createdProduct) {
        dispatch({ type: 'PRODUCT_CREATED', payload: createdProduct });
        navigate('ProductFind');
      }
    });
  }

  async function handleItemPress(product: ProductOrNormalizedProduct) {
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
  }

  function RenderInfo() {
    const {
      isSearching,
      isTyping,
      products,
      productName,
      barcode
    } = state;
    const isBusy = isSearching || isTyping;
    const isProductsNotEmpty = products.length > 0;
    const isProductNameNotTouched = productName.length === 0;
    const hasNotBeenSearching = isProductNameNotTouched && barcode === null;

    if (isBusy || isProductsNotEmpty || hasNotBeenSearching) {
      return null;
    }

    return (
      <>
        <NotFoundInfo>
          Nie znaleziono produktów.
        </NotFoundInfo>
        {!isConnected && (
          <NotFoundInfo>
            Aby wyszukiwać więcej produktów, przejdź do trybu online.
          </NotFoundInfo>
        )}
        <AddOwnProductButton
          onPress={handleProductCreateNavigation}
          accessibilityLabel="Dodaj własny produkt"
        >
          Dodaj własny
        </AddOwnProductButton>
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
          onChangeText={handleProductNameUpdate}
          isLoading={state.isSearching}
        />
        <BarcodeButton
          accessibilityLabel="Zeskanuj kod kreskowy"
          onPress={handleBarcodeScanNavigation}
        />
      </Block>
      <Text>{state.isTyping ? 'Pisze' : 'Nie pisze'}</Text>
      <Text>{state.productName}</Text>
      <SectionList
        data={state.products}
        keyExtractor={(product, index) => `${product.id}${index}`}
        keyboardShouldPersistTaps="handled"
        ItemSeparatorComponent={Separator}
        renderSectionHeader={({ section: { title }}) => (
          <SectionTitleContainer isFirst={title === SECTION_TITLE.foundProducts}>
            <Title>{title}</Title>
            {title === SECTION_TITLE.foundProducts && <RenderInfo />}
            {title === SECTION_TITLE.recentProducts && !isIdle && <ActivityIndicator />}
          </SectionTitleContainer>
        )}
        sections={[
          { title: SECTION_TITLE.foundProducts, data: state.products },
          { title: SECTION_TITLE.recentProducts, data: isIdle ? recentProducts : [] },
        ]}
        renderItem={({ item: product }: { item: ProductOrNormalizedProduct }) => (
          <ProductListItemMemo
            product={product}
            onPress={() => handleItemPress(product)}
          />
        )}
      />
    </Container>
  );
}

const Container = styled.View`
  padding: 20px 20px 60px 20px;
`

const NotFoundInfo = styled.Text`
  margin-top: 25px;
  text-align: center;
  font-family: ${props => props.theme.fontWeight.regular};
  padding: 0 50px;
`

const SectionTitleContainer = styled.View<{
  isFirst: boolean
}>`
  padding: ${props => props.isFirst ? '10px 0 5px 0' : '30px 0 5px 0'}
`

const AddOwnProductButton = styled(Button)`
  margin-top: 15px;
`

ProductFind.navigationOptions = {
  headerTitle: 'Znajdź produkt'
}

const SECTION_TITLE = {
  foundProducts: 'Znalezione produkty:',
  recentProducts: 'Ostatnie produkty:',
}

export type ProductResolver = () => Promise<Product>;