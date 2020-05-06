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
  ProductRecentListMemo,
  ProductFavoritesListMemo,
  ProductCreatedListMemo,
  ProductSearchListMemo,
  TabView,
  ProductSearcher,
  ActionSheet,
  ProductCreatedListRef,
} from '../../components';
import * as Utils from '../../utils';
import { BarcodeId, ValueOf } from '../../types';
import { useDispatch } from 'react-redux';
import { Actions } from '../../store';
import { useFocusEffect } from '@react-navigation/native';

interface ProductFindScreenState {
  productName: string
  barcode: BarcodeId | null
  activeTabIndex: number
  actionProduct: ProductOrNormalizedProduct | null
}

export const ProductFindScreen = () => {
  const { params, navigate, navigation } = useNavigationData<ProductFindScreenNavigationProps>();
  const [state, setState] = useNativeState<ProductFindScreenState>({
    activeTabIndex: TAB_INDEX.recent,
    productName: '',
    barcode: null,
    actionProduct: null,
  });
  const hasProductBeenSelected = useRef(false);
  const productNameDebounced = useDebouncedValue(state.productName);
  const dispatch = useDispatch();
  const productCreatedListRef = useRef<ProductCreatedListRef>(null);

  const cleanupState = useCallback(() => setState({ actionProduct: null }), []);

  useFocusEffect(cleanupState);

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

        setState({ activeTabIndex: TAB_INDEX.created });

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

  const handleProductActionRequest = useCallback((product: ProductOrNormalizedProduct): void => {
    setState({ actionProduct: product });
  }, []);

  const handleProductAction = (actionOption: ActionOption): void => {
    if (!(state.actionProduct instanceof Product)) {
      return;
    }

    switch(actionOption) {
      case PRODUCT_ACTION_OPTION.edit: 
        navigate('ProductCreate', {
          product: state.actionProduct,
          onProductEdited(editedProduct) {
            navigate('ProductFind');

            setState({ activeTabIndex: TAB_INDEX.created });

            productCreatedListRef.current?.refresh();
          }
        });
        break;
      
      case PRODUCT_ACTION_OPTION.showDetails: 
        navigate('ProductPreview', { product: state.actionProduct });
        break;
    }
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
        titles={['Ostatnio używane', 'Ulubione', 'Utworzone', 'Znalezione']}
        renderScene={props => {
          switch(props.route.index) {
            case TAB_INDEX.recent: return (
              <ProductRecentListMemo
                onProductSelect={handleProductSelect}
                onProductAction={handleProductActionRequest}
              />
            )
            case TAB_INDEX.favorite: return (
              <ProductFavoritesListMemo
                onProductSelect={handleProductSelect}
                onProductAction={handleProductActionRequest}  
              />
            )
            case TAB_INDEX.created: return (
              <ProductCreatedListMemo
                onProductSelect={handleProductSelect}
                onProductAction={handleProductActionRequest}
              />
            )
            case TAB_INDEX.search: return (
              <ProductSearchListMemo
                onProductSelect={handleProductSelect}
                onProductAction={handleProductActionRequest}
                productName={productNameDebounced}
                barcode={state.barcode}
              />
            )
            default: return null;
          }
        }}
      />
      {state.actionProduct && (
        <ActionSheet
          title={state.actionProduct.name}
          options={[
            PRODUCT_ACTION_OPTION.showDetails,
            PRODUCT_ACTION_OPTION.edit,
          ]}
          onAction={handleProductAction}
          onDismiss={() => setState({ actionProduct: null })}
        />
      )}
    </Container>
  );
}

const TAB_INDEX = {
  recent: 0,
  favorite: 1,
  created: 2,
  search: 3,
} as const;

const PRODUCT_ACTION_OPTION = {
  showDetails: 'Pokaż szczegóły',
  edit: 'Edytuj',
} as const;

const Container = styled.View`
  flex: 1;
  padding-top: ${props => props.theme.spacing.small};
`

const AddOwnProductButton = styled(ButtonSecondaryArrow)`
  margin-right: ${props => props.theme.spacing.micro};
`

export type ProductResolver = () => Promise<Product>;

type ActionOption = ValueOf<typeof PRODUCT_ACTION_OPTION>;