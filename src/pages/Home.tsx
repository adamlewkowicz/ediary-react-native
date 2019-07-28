import React, { useState, useEffect, useMemo } from 'react';
import { Layout, Text, Input, Button } from 'react-native-ui-kitten';
import { getRepository } from 'typeorm/browser';
import { Product, Meal } from '../entities';
import { useDispatch, useSelector } from 'react-redux';
import * as Actions from '../store/actions-root';
import { AppState } from '../store';
import { TouchableHighlight } from 'react-native';
import { mergedMealSelector } from '../store/selectors';

export const Home = () => {
  const [name, setName] = useState('Zupa');
  const dispatch = useDispatch();
  const meals = useSelector<AppState, AppState['diary']['meals']>(
    state => state.diary.meals
  );
  const products = useSelector<AppState, AppState['diary']['products']>(
    state => state.diary.products
  );
  const mealsMerged = useMemo(() =>
    mergedMealSelector(meals, products as any),
    [meals, products]
  );

  async function handleProductCreate() {
    const productRepo = getRepository(Product)
    await productRepo.save({
      name
    });

    const products = await productRepo.find();
    console.log({ products })
  }

  return (
    <Layout style={{ flex: 1 }}>
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
      <Button onPress={() => dispatch(Actions.mealProductCreate(
        mealsMerged[0].id,
        { name } as any
      ))}>
        Dodaj produkt (Pierwszy posiłek)
      </Button>
      {mealsMerged.map(meal => (
        <TouchableHighlight
          key={meal.id}
          onPress={() => dispatch(Actions.mealDelete(meal.id))}
        >
          <Text category="h4">
            {meal.name}
          </Text>
        </TouchableHighlight>
      ))}
    </Layout>
  );
}