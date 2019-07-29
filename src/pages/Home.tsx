import React, { useState, useMemo } from 'react';
import { Layout, Text, Input, Button } from 'react-native-ui-kitten';
import { useDispatch, useSelector } from 'react-redux';
import * as Actions from '../store/actions';
import { AppState } from '../store';
import { TouchableHighlight, View, TouchableOpacity } from 'react-native';
import { mergedMealSelector } from '../store/selectors';
import { MealList } from '../components/MealList';
import { DateChanger } from '../components/DateChanger';
import { ProgressBar } from '../components/ProgressBar';

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

  return (
    <Layout style={{ flex: 1 }}>
      <DateChanger date={new Date} />
      <ProgressBar
        percentages={45}
        colors={['#5DB4CF', '#C5FBFF']}
      />
      <Text category="h3">Home</Text>
      <Input
        placeholder="Nazwa nowego posiłku"
        value={name}
        onChangeText={name => setName(name)}
      />
      <Button onPress={() => dispatch(Actions.mealCreate(name))}>
        Dodaj posiłek
      </Button>
      <Button onPress={() => dispatch(Actions.mealProductCreate(
        mealsMerged[0].id,
        { name } as any
      ))}>
        Dodaj produkt (Pierwszy posiłek)
      </Button>
      <Button onPress={() => dispatch(Actions.productUpdate(
        mealsMerged[0].products[0].id,
        { name }
      ))}>
        Aktualizuj nazwę (Pierwszy produkt)
      </Button>
      <MealList
        meals={mealsMerged}
      />
      {mealsMerged.map(meal => (
        <TouchableHighlight
          key={meal.id}
          onPress={() => dispatch(Actions.mealDelete(meal.id))}
        >
          <View>
            <Text category="h4">
              {meal.name}
            </Text>
            <Text category="h6">
              Produkty: ({meal.products.length as any})
            </Text>
            {meal.products.map(product => (
              <TouchableOpacity
                key={product.id}
                onPress={() => dispatch(
                  Actions.mealProductDelete(meal.id, product.id)
                )}
              >
                <Text category="h6">
                  {product.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableHighlight>
      ))}
    </Layout>
  );
}