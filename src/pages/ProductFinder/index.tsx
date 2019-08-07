import React, { useState, useRef } from 'react';
import styled from 'styled-components/native';
import { debounce } from '../../common/utils';
import { FlatList } from 'react-native';
import { getCustomRepository } from 'typeorm/browser';
import { Product } from '../../entities';
import { ProductListItem } from '../../components/ProductListItem';
import { InputSearcher } from '../../components/InputSearcher';
import { NavigationScreenProps } from 'react-navigation';
import { ProductRepository } from '../../repositories/ProductRepository';
import { useSelector } from 'react-redux';
import { AppState } from '../../store';
import { Theme } from '../../common/theme';

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

    debounce(async () => {
      const foundProducts = await getCustomRepository(ProductRepository)[findMethod](
        trimmedName
      );

      const nameLowered = trimmedName.toLowerCase();

      const sortedProducts = foundProducts
        .sort((a, b) => {
          const aLowered = a.name.toLowerCase();
          const bLowered = b.name.toLowerCase();
        
          const aIndex = aLowered.indexOf(nameLowered);
          const bIndex = bLowered.indexOf(nameLowered);

          const notFoundIndex = -1;
          const orderByShorter = aLowered.length > bLowered.length ? 1 : -1;
        
          if (aIndex === notFoundIndex && bIndex === notFoundIndex) {
            return -1;
          }
          if (aIndex === notFoundIndex) {
            return 1;
          }
          if (bIndex === notFoundIndex) {
            return -1;
          }

          if (aLowered.length === bLowered.length) {
            return 0;
          }

          return orderByShorter;
        });

      setProducts(sortedProducts);
      setLoading(false);
    }, 100);
  }

  return (
    <Container>
      <InputSearcher
        value={name}
        placeholder="Nazwa produktu"
        onChangeText={handleProductSearch}
        isLoading={isLoading}
      />
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
          {!isConnected && 'Przejdź do trybu online aby wyszukiwać produkty, lub utwórz własny.'}
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