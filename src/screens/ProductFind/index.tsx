import React, { useState, useRef } from 'react';
import styled from 'styled-components/native';
import { sortByMostAccurateName, debounce_ } from '../../common/utils';
import { Product } from '../../database/entities';
import { ProductListItem, Separator } from '../../components/ProductListItem';
import { InputSearcher } from '../../components/InputSearcher';
import { NavigationScreenProps, SectionList } from 'react-navigation';
import { Block, Title } from '../../components/Elements';
import { BarcodeButton } from '../../components/BarcodeButton';
import { BarcodeScanParams } from '../BarcodeScan';
import { Screen, BarcodeId } from '../../types';
import { Button } from 'react-native-ui-kitten';
import { ProductCreateParams } from '../ProductCreate';
import { useConnected, useIdleStatus } from '../../hooks';
import { useSelector } from 'react-redux';
import { StoreState } from '../../store';
import { ActivityIndicator } from 'react-native';

const debounceA = debounce_();
const SECTION_TITLE = {
  foundProducts: 'Znalezione produkty:',
  recentProducts: 'Ostatnie produkty:',
}

interface ProductFindProps extends NavigationScreenProps {}
export const ProductFind = (props: ProductFindProps) => {
  const { current: params } = useRef<ProductFindParams>({
    onItemPress: props.navigation.getParam('onItemPress')
  });
  const [name, setName] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setLoading] = useState(false);
  const [barcode, setBarcode] = useState<BarcodeId | null>(null);
  const isConnected = useConnected();
  const productsAreEmpty = !products.length;
  const recentProducts = useSelector((state: StoreState) => state.diary.recentProducts);
  const hasBeenPressed = useRef(false);
  const isIdle = useIdleStatus();

  function handleProductSearch(name: string) {
    setName(name);
    if (!isLoading) setLoading(true);
    const trimmedName = name.trim();
    const methodName = isConnected ? 'findAndFetchByNameLike' : 'findByNameLike';

    debounceA(async () => {
      const foundProducts = await Product[methodName](trimmedName);
      const sortedProducts = foundProducts
        .sort(sortByMostAccurateName(name));

      setProducts(sortedProducts);
      setLoading(false);
    }, 600);
  }

  function handleBarcodeScanNavigation() {
    const screenParams: BarcodeScanParams = {
      async onBarcodeDetected(barcode) {
        const finderScreen: Screen = 'ProductFind';
        props.navigation.navigate(finderScreen);
        setName('');
        setProducts([]);
        setLoading(true);

        const methodName = isConnected ? 'findAndFetchByBarcode' : 'findByBarcode';
        const foundProducts = await Product[methodName](barcode);

        if (foundProducts.length) {
          setProducts(foundProducts);
        } else {
          setBarcode(barcode);
        }
        setLoading(false);
      }
    }
    
    const barcodeScreen: Screen = 'BarcodeScan';
    props.navigation.navigate(barcodeScreen, screenParams);
  }

  function handleProductCreateNavigation() {
    const screen: Screen = 'ProductCreate';
    const screenParams: ProductCreateParams = {
      barcode: barcode ? barcode : undefined,
      name: name.trim(),
      onProductCreated(createdProduct) {
        setBarcode(null);
        setProducts([createdProduct]);
        setLoading(false);
        props.navigation.navigate('ProductFind');
      }
    }
    props.navigation.navigate(screen, screenParams);
  }

  function renderInfo() {
    if (
      isLoading ||
      !productsAreEmpty ||
      (!name.length && barcode === null)
    ) return null;

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
        <Button
          style={{ marginTop: 15 }}
          onPress={handleProductCreateNavigation}
        >
          Dodaj własny
        </Button>
      </>
    );
  }

  function handleItemPress(item: Product) {
    if (params.onItemPress && !hasBeenPressed.current) {
      hasBeenPressed.current = true;
      params.onItemPress(item);
    }
  }

  return (
    <Container>
      <Block space="space-between" align="center">
        <InputSearcher
          value={name}
          placeholder="Nazwa produktu"
          onChangeText={handleProductSearch}
          isLoading={isLoading}
        />
        <BarcodeButton
          onPress={handleBarcodeScanNavigation}
        />
      </Block>
      <SectionList
        data={products}
        keyExtractor={(product, index) => `${product.id}${index}`}
        keyboardShouldPersistTaps="handled"
        ItemSeparatorComponent={Separator}
        renderSectionHeader={({ section: { title }}) => (
          <SectionTitleContainer isFirst={title === SECTION_TITLE.foundProducts}>
            <Title>{title}</Title>
            {title === SECTION_TITLE.foundProducts && renderInfo()}
            {title === SECTION_TITLE.recentProducts && !isIdle && <ActivityIndicator />}
          </SectionTitleContainer>
        )}
        sections={[
          { title: SECTION_TITLE.foundProducts, data: products },
          { title: SECTION_TITLE.recentProducts, data: isIdle ? recentProducts : [] },
        ]}
        renderItem={({ item }) => (
          <ProductListItem
            product={item}
            onPress={() => handleItemPress(item)}
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

ProductFind.navigationOptions = {
  headerTitle: 'Znajdź produkt'
}

export type HandleItemPressHandler = ((product: Product) => void) | undefined;
export type ProductFindParams = {
  onItemPress?: HandleItemPressHandler
}