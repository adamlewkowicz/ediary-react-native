import React, { useState } from 'react';
import styled from 'styled-components/native';
import { Theme } from '../../common/theme';
import { debounce } from '../../common/utils';
import { ActivityIndicator, FlatList } from 'react-native';
import { productRepository } from '../../repositories';
import { Like } from 'typeorm/browser';
import { Product } from '../../entities';
import { ProductListItem } from '../../components/ProductListItem';

export const ProductFinder = () => {
  const [name, setName] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setLoading] = useState(false);

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
    });
  }

  return (
    <Container>
      <FinderInput
        value={name}
        onChangeText={handleProductSearch}
      />
      <FlatList
        data={products}
        keyExtractor={product => product.id.toString()}
        renderItem={({ item }) => (
          <ProductName>
            {item.name}
          </ProductName>
        )}
      />
      {isLoading && <ActivityIndicator size="large" />}
    </Container>
  );
}

const Container = styled.View`
  padding: 20px;
`

const FinderInput = styled.TextInput<{
  theme: Theme
}>`
  font-size: 25px;
  color: #626262;
  font-family: ${props => props.theme.fontFamily};
  font-weight: 600;
`

const ProductName = styled.Text``