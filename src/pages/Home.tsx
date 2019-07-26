import React, { useState } from 'react';
import { Layout, Text, Input, Button } from 'react-native-ui-kitten';
import { useRepositories } from '../common/hooks';
import { getRepository } from 'typeorm/browser';
import { Product } from '../entities';

export const Home = () => {
  const [name, setName] = useState('Zupa');
  const repositories = useRepositories();

  function handleProductCreate() {
    const productRepo = getRepository(Product)
    productRepo.save({
      name
    });
  }

  return (
    <Layout style={{flex: 1}}>
      <Text category="h3">Home</Text>
      <Input
        placeholder="Nazwa nowego posiłku"
        value={name}
        onChangeText={name => setName(name)}
      />
      <Button onPress={handleProductCreate}>
        Dodaj posiłek
      </Button>
    </Layout>
  );
}