import React, { useState, useRef } from 'react';
import styled from 'styled-components/native';
import { debounce } from '../../common/utils';
import { ActivityIndicator, FlatList } from 'react-native';
import { getCustomRepository } from 'typeorm/browser';
import { Product } from '../../entities';
import { ProductListItem } from '../../components/ProductListItem';
import { InputSearcher } from '../../components/InputSearcher';
import { NavigationScreenProps } from 'react-navigation';
import { ProductRepository } from '../../repositories/ProductRepository';

interface ProductFinderProps extends NavigationScreenProps {}
export const ProductFinder = (props: ProductFinderProps) => {
  const [name, setName] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setLoading] = useState(false);
  const { current: params } = useRef<ProductFinderParams>({
    onItemPress: props.navigation.getParam('onItemPress')
  });

  function handleProductSearch(name: string) {
    setName(name);
    if (!isLoading) setLoading(true);
    const trimmedName = name.trim();
    
    debounce(async () => {
      const foundProducts = await getCustomRepository(ProductRepository)
        .findAndFetchByNameLike(trimmedName);

      const nameLowered = trimmedName.toLowerCase();

      const sortedProducts = foundProducts
        .sort((a, b) => {
          const aName = a.name.toLowerCase();
          const bName = b.name.toLowerCase();

          const aIndex = aName.indexOf(nameLowered);
          const bIndex = bName.indexOf(nameLowered);
          
          return aIndex - bIndex;
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
        showLabel={!name.length}
      />
      <FlatList
        data={products}
        keyExtractor={product => product.id.toString()}
        renderItem={({ item, index }) => (
          <ProductListItem
            product={item}
            hideBottomLine={index === products.length - 1}
            onPress={() => params.onItemPress && params.onItemPress(item)}
          />
        )}
      />
      {isLoading && <ActivityIndicator size="large" />}
    </Container>
  );
}

const Container = styled.View`
  padding: 20px;
`

ProductFinder.navigationOptions = {
  headerTitle: 'Znajdź produkt'
}

export type HandleItemPressHandler = ((product: Product) => void) | undefined;
export type ProductFinderParams = {
  onItemPress?: HandleItemPressHandler
}