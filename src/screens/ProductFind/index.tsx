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
} from '../../components';
import * as Utils from '../../utils';
import { BarcodeId, ValueOf } from '../../types';
import { useDispatch } from 'react-redux';
import { Actions } from '../../store';

interface ProductFindScreenState {
  productName: string
  barcode: BarcodeId | null
  createdProduct: Product | null
  activeTabIndex: number
  productAction: ProductOrNormalizedProduct | null
  refreshTabIndex: number | null
}

export const ProductFindScreen = () => {
  const { params, navigate, navigation } = useNavigationData<ProductFindScreenNavigationProps>();
  const [state, setState] = useNativeState<ProductFindScreenState>({
    activeTabIndex: TAB_INDEX.recent,
    productName: '',
    barcode: null,
    createdProduct: null,
    productAction: null,
    refreshTabIndex: null,
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
          activeTabIndex: TAB_INDEX.created,
          refreshTabIndex: TAB_INDEX.created,
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

  const handleProductActionRequest = useCallback((product: ProductOrNormalizedProduct): void => {
    setState({ productAction: product });
  }, []);

  const handleProductAction = (actionOption: ActionOption): void => {
    if (!(state.productAction instanceof Product)) {
      return;
    }

    switch(actionOption) {
      case PRODUCT_ACTION_OPTION.edit: 
        navigate('ProductCreate', {
          product: state.productAction,
          onProductEdited(editedProduct) {
            navigate('ProductFind');

            // @TODO Request refresh on this tab index
            setState({
              activeTabIndex: TAB_INDEX.created,
              refreshTabIndex: TAB_INDEX.created,
            });
          }
        });
        break;
      
      case PRODUCT_ACTION_OPTION.showDetails: 
        navigate('ProductPreview', {
          product: state.productAction,
        });
        break;
    }

    setState({ productAction: null });
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
                createdProduct={state.createdProduct}
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
      {state.productAction && (
        <ActionSheet
          title={state.productAction.name}
          options={[
            PRODUCT_ACTION_OPTION.showDetails,
            PRODUCT_ACTION_OPTION.edit,
          ]}
          onAction={handleProductAction}
          onDismiss={() => setState({ productAction: null })}
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

const isInstanceOfProduct = (
  product: ProductOrNormalizedProduct | null
): product is Product => product instanceof Product;