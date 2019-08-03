import React, { useState } from 'react';
import styled from 'styled-components/native';
import { debounce } from '../../common/utils';
import { ActivityIndicator, FlatList } from 'react-native';
import { productRepository } from '../../repositories';
import { Like } from 'typeorm/browser';
import { Product } from '../../entities';
import { ProductListItem } from '../../components/ProductListItem';
import { InputSearcher } from '../../components/InputSearcher';

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