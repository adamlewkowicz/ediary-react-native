import React, { useState, useRef } from 'react';
import styled from 'styled-components/native';
import { sortByMostAccurateName, debounce_ } from '../../common/utils';
import { Product } from '../../database/entities';
import { ProductListItem } from '../../components/ProductListItem';
import { InputSearcher } from '../../components/InputSearcher';
import { NavigationScreenProps, SectionList } from 'react-navigation';
import { Theme } from '../../common/theme';
import { Block } from '../../components/Elements';
import { BarcodeButton } from '../../components/BarcodeButton';
import { BarcodeScanParams } from '../BarcodeScan';
import { Screen, BarcodeId } from '../../types';
import { Button } from 'react-native-ui-kitten';
import { ProductCreateParams } from '../ProductCreate';
import { useConnected } from '../../common/hooks';
import { useSelector } from 'react-redux';
import { StoreState } from '../../store';

const debounceA = debounce_();
const debounceB = debounce_();

interface ProductFindProps extends NavigationScreenProps {}
export const ProductFind = (props: ProductFindProps) => {
  const [name, setName] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setLoading] = useState(false);
  const [barcode, setBarcode] = useState<BarcodeId | null>(null);
  const isConnected = useConnected();
  const productsAreEmpty = !products.length;
  const { current: params } = useRef<ProductFindParams>({
    onItemPress: props.navigation.getParam('onItemPress')
  });
  const [isTyping, setTyping] = useState(false);
  const recentProducts = useSelector((state: StoreState) => state.diary.recentProducts);
  const [calls, setCalls] = useState(0);

  async function finder(name: string) {
    const methodName = isConnected ? 'findAndFetchByNameLike' : 'findByNameLike';

    if (!name.length) return;
    setCalls(calls => calls + 1);
    const foundProducts = await Product[methodName](name);
    console.log({ foundProductsL: foundProducts.length })
    // const sortedProducts = foundProducts
    //   .sort(sortByMostAccurateName(name));

    setProducts(foundProducts);
    setLoading(false);
  }

  function handleProductSearch(name: string) {
    setName(name);
    setTyping(true);
    if (!isLoading) setLoading(true);
    const trimmedName = name.trim();
    const methodName = isConnected ? 'findAndFetchByNameLike' : 'findByNameLike';

    debounceB(() => setTyping(false), 1000);

    debounceA(() => finder(trimmedName), 800);
    // debounceA(async () => {
    //   if (!name.length) return;
    //   setCalls(calls => calls + 1);
    //   const foundProducts = await Product[methodName](trimmedName);
    //   console.log({ foundProductsL: foundProducts.length })
    //   // const sortedProducts = foundProducts
    //   //   .sort(sortByMostAccurateName(name));

    //   setProducts(foundProducts);
    //   setLoading(false);
    // }, 600);
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
      name: name.length ? name.trim() : undefined,
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
      <Title marginVertical={15}>Calls: {calls}</Title>
      <Title marginVertical={15}>Calls: {calls}</Title>
      <SectionList
        data={products}
        keyExtractor={(product, index) => `${product.id}${index}`}
        renderSectionHeader={({section: { title }}) => (
          <Title marginVertical={15}>{title}</Title>
        )}
        sections={[
          { title: 'Znalezione produkty:', data: products },
          { title: 'Ostatnie produkty:', data: recentProducts },
        ]}
        renderItem={({ item, index }) => (
          <ProductListItem
            product={item}
            hideBottomLine={index === products.length - 1}
            onPress={() => params.onItemPress && params.onItemPress(item)}
            phrase={name}
          />
        )}
      />
      {renderInfo()}
    </Container>
  );
}

const Container = styled.View`
  padding: 20px;
`

const Title = styled.Text<{
  theme: Theme
  marginVertical?: number
}>`
  font-family: ${props => props.theme.font.medium};
  text-transform: uppercase;
  color: ${props => props.theme.colors.gray};
  font-size: 14px;
  letter-spacing: 0.5px;
  margin-vertical: ${props => props.marginVertical || 0};
`;

const NotFoundInfo = styled.Text<{
  theme: Theme
}>`
  margin-top: 25px;
  text-align: center;
  font-family: ${props => props.theme.fontFamily};
  padding: 0 50px;
`

ProductFind.navigationOptions = {
  headerTitle: 'Znajdź produkt'
}

export type HandleItemPressHandler = ((product: Product) => void) | undefined;
export type ProductFindParams = {
  onItemPress?: HandleItemPressHandler
}