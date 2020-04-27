import React, { useRef, useCallback } from 'react';
import styled from 'styled-components/native';
import { Product, ProductOrNormalizedProduct } from '../../database/entities';
import {
  useNavigationData,
  useDebouncedValue,
  useNativeState,
  useIntl,
} from '../../hooks';
import { ProductFindScreenNavigationProps } from '../../navigation';
import {
  ButtonSecondaryArrow,
  ProductRecentListMemo,
  ProductFavoritesListMemo,
  ProductCreatedListMemo,
  ProductSearchListMemo,
  TabView,
  ProductSearcher,
} from '../../components';
import * as Utils from '../../utils';
import { BarcodeId } from '../../types';
import { useDispatch } from 'react-redux';
import { Actions } from '../../store';

interface ProductFindScreenState {
  productName: string
  barcode: BarcodeId | null
  createdProduct: Product | null
  activeTabIndex: number
}

export const ProductFindScreen = () => {
  const { params, navigate, navigation } = useNavigationData<ProductFindScreenNavigationProps>();
  const [state, setState] = useNativeState<ProductFindScreenState>({
    activeTabIndex: TAB_INDEX.recent,
    productName: '',
    barcode: null,
    createdProduct: null,
  });
  const hasProductBeenSelected = useRef(false);
  const productNameDebounced = useDebouncedValue(state.productName);
  const dispatch = useDispatch();
  const t = useIntl();

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
          activeTabIndex: TAB_INDEX.created,
          createdProduct,
        });

        Utils.toastCenter(t.createdProduct(createdProduct.name));

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
        accessibilityLabel={t.createOwnProductLabel}
        accessibilityHint={t.createOwnProductHint}
        role="link"
      >
        Stwórz
      </AddOwnProductButton>
    )
  });

  const handleInputFocus = (): void => {
    if (state.activeTabIndex !== TAB_INDEX.search) {
      setState({ activeTabIndex: TAB_INDEX.search });
    }
  }

  return (
    <Container>
      <ProductSearcher
        value={state.productName}
        onChangeText={productName => setState({ productName })}
        onFocus={handleInputFocus}
        onBarcodeScan={handleBarcodeScan}
      />
      <TabView
        activeIndex={state.activeTabIndex}
        onIndexChange={activeTabIndex => setState({ activeTabIndex })}
        titles={[
          t.productsRecent,
          t.productsFavorite,
          t.productsCreated,
          t.productsFound,
        ]}
        renderScene={props => {
          switch(props.route.index) {
            case TAB_INDEX.recent: return (
              <ProductRecentListMemo onProductSelect={handleProductSelect} />
            )
            case TAB_INDEX.favorite: return (
              <ProductFavoritesListMemo onProductSelect={handleProductSelect} />
            )
            case TAB_INDEX.created: return (
              <ProductCreatedListMemo
                onProductSelect={handleProductSelect}
                createdProduct={state.createdProduct}
              />
            )
            case TAB_INDEX.search: return (
              <ProductSearchListMemo
                onProductSelect={handleProductSelect}
                productName={productNameDebounced}
                barcode={state.barcode}
              />
            )
            default: return null;
          }
        }}
      />
    </Container>
  );
}

const TAB_INDEX = {
  recent: 0,
  favorite: 1,
  created: 2,
  search: 3,
} as const;

const Container = styled.View`
  flex: 1;
  padding-top: ${props => props.theme.spacing.small};
`

const AddOwnProductButton = styled(ButtonSecondaryArrow)`
  margin-right: ${props => props.theme.spacing.micro};
`

export type ProductResolver = () => Promise<Product>;