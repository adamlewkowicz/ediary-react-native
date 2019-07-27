import React, { useState, useEffect } from 'react';
import { Layout, Text, Input, Button } from 'react-native-ui-kitten';
import { useRepositories } from '../common/hooks';
import { getRepository } from 'typeorm/browser';
import { Product } from '../entities';
import { useDispatch } from 'react-redux';
import * as Actions from '../store/actions';

export const Home = () => {
  const [name, setName] = useState('Zupa');
  const repositories = useRepositories();
  const dispatch = useDispatch();

  async function handleProductCreate() {
    const productRepo = getRepository(Product)
    await productRepo.save({
      name
    });

    const products = await productRepo.find();
    console.log({ products })
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
      <Button onPress={() => dispatch(Actions.mealCreate(name))}>
        Dodaj posiłek (dispatch)
      </Button>
    </Layout>
  );
}