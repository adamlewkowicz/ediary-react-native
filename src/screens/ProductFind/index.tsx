import React, { useRef, useReducer, useEffect } from 'react';
import styled from 'styled-components/native';
import { Product, ProductOrNormalizedProduct } from '../../database/entities';
import { ProductListItemMemo, Separator } from '../../components/ProductListItem';
import { InputSearcher } from '../../components/InputSearcher';
import { SectionList } from 'react-navigation';
import { Block, Title } from '../../components/Elements';
import { BarcodeButton } from '../../components/BarcodeButton';
import { Button } from '../../components/Button';
import {
  useConnected,
  useIdleStatus,
  useNavigate,
  useCurrentState,
  useNavigationParams,
} from '../../hooks';
import { useSelector } from 'react-redux';
import { StoreState } from '../../store';
import { ActivityIndicator, Text } from 'react-native';
import { ProductFindParams } from './params';
import { productFindReducer, initialState } from './reducer';
import { ABORT_ERROR_NAME } from '../../common/consts';

let isTypingTimeout: NodeJS.Timeout;

interface ProductFindProps {}

export const ProductFind = (props: ProductFindProps) => {
  const [state, dispatch] = useReducer(productFindReducer, initialState);
  const [isTyping, setIsTyping] = useCurrentState(false);
  const params = useNavigationParams<ProductFindParams>();
  const isConnected = useConnected();
  const recentProducts = useSelector((state: StoreState) => state.productHistory);
  const hasBeenPressed = useRef(false);
  const isIdle = useIdleStatus();
  const navigate = useNavigate();

  const handleProductNameUpdate = (productName: string): void => {
    clearTimeout(isTypingTimeout);

    setIsTyping(true);
    dispatch({ type: 'PRODUCT_NAME_UPDATED', payload: productName });

    isTypingTimeout = setTimeout(
      () => setIsTyping(false),
      800
    );
  }

  useEffect(() => {
    const { productName } = state;
    console.log({ isTyping,  productName })
    if (isTyping.current || !state.productName.length) return;

    const controller = new AbortController();
    const trimmedName = state.productName.trim();
    const methodName = isConnected ? 'findAndFetchByNameLike' : 'findByNameLike';

    const findProducts = () => {
      dispatch({ type: 'PRODUCTS_SEARCH_STARTED' });

      Product[methodName](trimmedName, controller)
        .then(payload => {
          if (isTyping.current) return;
          dispatch({ type: 'PRODUCTS_UPDATED', payload });
        })
        .catch(error => {
          if (error.name !== ABORT_ERROR_NAME) {
            throw error;
          }
        })
        .finally(() => dispatch({ type: 'PRODUCTS_SEARCH_FINISHED' }));
    }

    findProducts();

    return () => controller.abort();
  }, [state.productName, isTyping.current, isConnected]);

  function handleBarcodeScanNavigation() {
    navigate('BarcodeScan', {
      async onBarcodeDetected(barcode) {
        // Imitate typing to prevent searching products by user during barcode search
        setIsTyping(true);
        dispatch({ type: 'BARCODE_SEARCH_STARTED' });
        navigate('ProductFind');

        const methodName = isConnected ? 'findAndFetchByBarcode' : 'findByBarcode';
        const foundProducts = await Product[methodName](barcode);

        dispatch({ type: 'BARCODE_SEARCH_FINISHED', payload: { barcode, foundProducts }});
        setIsTyping(false);
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
      products,
      productName,
      barcode
    } = state;
    const isBusy = isSearching || isTyping.current;
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
      <Text>{isTyping ? 'Pisze' : 'Nie pisze'}</Text>
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
            accessibilityLabel="Dodaj produkt do posiłku"
            accessibilityHint="Wraca na główną stronę i dodaje produkt do posiłku"
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