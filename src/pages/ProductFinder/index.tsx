import React, { useState, useRef } from 'react';
import styled from 'styled-components/native';
import { debounce } from '../../common/utils';
import { ActivityIndicator, FlatList } from 'react-native';
import { productRepository } from '../../repositories';
import { Like } from 'typeorm/browser';
import { Product } from '../../entities';
import { ProductListItem } from '../../components/ProductListItem';
import { InputSearcher } from '../../components/InputSearcher';
import { NavigationScreenProps } from 'react-navigation';

interface ProductFinderProps extends NavigationScreenProps {}
export const ProductFinder = (props: ProductFinderProps) => {
  const [name, setName] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setLoading] = useState(false);
  const { current: handleItemPress } = useRef<HandleItemPressHandler>(
    props.navigation.getParam('onItemPress')
  );

  function handleProductSearch(name: string) {
    if (!isLoading) setLoading(true);
    setName(name);
    
    debounce(async () => {
      const foundProducts = await productRepository().find({
        where: { name: Like(`%${name}%`) },
        take: 10 
      });

      setProducts(foundProducts);
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
            onPress={() => handleItemPress && handleItemPress(item)}
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