import React, { useState, useRef } from 'react';
import styled from 'styled-components/native';
import { sortByMostAccurateName, debounce_ } from '../../common/utils';
import { FlatList } from 'react-native';
import { Product } from '../../database/entities';
import { ProductListItem } from '../../components/ProductListItem';
import { InputSearcher } from '../../components/InputSearcher';
import { NavigationScreenProps } from 'react-navigation';
import { useSelector } from 'react-redux';
import { AppState } from '../../store';
import { Theme } from '../../common/theme';
import { Block } from '../../components/Elements';
import { BarcodeButton } from '../../components/BarcodeButton';
import { BarcodeScanParams } from '../BarcodeScan';
import { Screen } from '../../types';

const debounceA = debounce_();

interface ProductFinderProps extends NavigationScreenProps {}
export const ProductFinder = (props: ProductFinderProps) => {
  const [name, setName] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setLoading] = useState(false);
  const isConnected = useSelector<AppState, boolean>(state => state.application.isConnected);
  const productsAreEmpty = !products.length;
  const { current: params } = useRef<ProductFinderParams>({
    onItemPress: props.navigation.getParam('onItemPress')
  });

  function handleProductSearch(name: string) {
    setName(name);
    if (!isLoading) setLoading(true);
    const trimmedName = name.trim();
    const findMethod = isConnected ? 'findAndFetchByNameLike' : 'findByNameLike';

    debounceA(async () => {
      const foundProducts = await Product[findMethod](trimmedName);

      const sortedProducts = foundProducts
        .sort(sortByMostAccurateName(name));

      setProducts(sortedProducts);
      setLoading(false);
    }, 600);
  }

  function handleBarcodeScanNavigation() {
    const screenParams: BarcodeScanParams = {
      async onBarcodeDetected(barcode) {
        const finderScreen: Screen = 'ProductFinder';
        props.navigation.navigate(finderScreen);
        setName('');
        setProducts([]);
        setLoading(true);

        const foundProducts = await Product.findByBarcode(barcode);

        if (foundProducts.length) {
          setProducts(foundProducts);
        }
        setLoading(false);
      }
    }
    
    const barcodeScreen: Screen = 'BarcodeScan';
    props.navigation.navigate(barcodeScreen, screenParams);
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
      <FlatList
        data={products}
        keyExtractor={product => product.id.toString()}
        renderItem={({ item, index }) => (
          <ProductListItem
            product={item}
            hideBottomLine={index === products.length - 1}
            onPress={() => params.onItemPress && params.onItemPress(item)}
            phrase={name}
          />
        )}
      />
      {!isLoading && productsAreEmpty && !!name.length && (
        <NotFoundInfo>
          Nie znaleziono żadnych produktów.
          {!isConnected && ' Przejdź do trybu online aby wyszukiwać produkty, lub utwórz własny.'}
        </NotFoundInfo>
      )}
    </Container>
  );
}

const Container = styled.View`
  padding: 20px;
`

const NotFoundInfo = styled.Text<{
  theme: Theme
}>`
  margin-top: 25px;
  text-align: center;
  font-family: ${props => props.theme.fontFamily};
  padding: 0 50px;
`

ProductFinder.navigationOptions = {
  headerTitle: 'Znajdź produkt'
}

export type HandleItemPressHandler = ((product: Product) => void) | undefined;
export type ProductFinderParams = {
  onItemPress?: HandleItemPressHandler
}