import React, { useRef, useCallback } from 'react';
import styled from 'styled-components/native';
import { Product, ProductOrNormalizedProduct } from '../../database/entities';
import {
  useNavigationData,
  useDebouncedValue,
  useNativeState,
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
import { useDispatch } from 'react-redux';
import { Actions } from '../../store';

interface ProductFindScreenState {
  activeRoute: TabRoute
  productName: string
  barcode: BarcodeId | null
  createdProduct: Product | null
}

export const ProductFindScreen = () => {
  const { params, navigate, navigation } = useNavigationData<ProductFindScreenNavigationProps>();
  const [state, setState] = useNativeState<ProductFindScreenState>({
    activeRoute: TAB_ROUTE.recent,
    productName: '',
    barcode: null,
    createdProduct: null,
  });
  const hasProductBeenSelected = useRef(false);
  const productNameDebounced = useDebouncedValue(state.productName);
  const dispatch = useDispatch();

  function handleBarcodeScan() {
    navigate('BarcodeScan', {
      onBarcodeDetected(barcode) {
        navigate('ProductFind');

        setState({ barcode });
      }
    });
  }

  function handleProductCreate() {
    navigate('ProductCreate', {
      barcode: state.barcode ?? undefined,
      name: state.productName.trim(),
      onProductCreated(createdProduct) {
        navigate('ProductFind');

        setState({
          activeRoute: TAB_ROUTE.created,
          createdProduct,
        });

        Utils.toastCenter(`Utworzono produkt "${createdProduct.name}"`);

        dispatch(Actions.productHistoryAdded([createdProduct]));
      }
    });
  }

  const handleProductSelect = useCallback((product: ProductOrNormalizedProduct): void => {
    if (!params.onProductSelected || hasProductBeenSelected.current) {
      return;
    }

    hasProductBeenSelected.current = true;

    const productResolver: ProductResolver = async () => {
      if (product instanceof Product) {
        return product;
      }
      return Product.saveNormalizedProduct(product);
    }

    params.onProductSelected(productResolver, product.portion);
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
    if (state.activeRoute !== TAB_ROUTE.search) {
      setState({ activeRoute: TAB_ROUTE.search });
    }
  }

  return (
    <Container>
      <SearchContainer>
        <InputSearcher
          value={state.productName}
          onChangeText={productName => setState({ productName })}
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
        activeRoute={state.activeRoute}
        onRouteChange={activeRoute => setState({ activeRoute })}
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
              createdProduct={state.createdProduct}
            />
          ),
          [TAB_ROUTE.search]: (
            <ProductSearchListMemo
              onProductSelect={handleProductSelect}
              productName={productNameDebounced}
              barcode={state.barcode}
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