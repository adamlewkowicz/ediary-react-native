import React, { useState, useMemo } from 'react';
import { Input, Button } from 'react-native-ui-kitten';
import { useDispatch, useSelector } from 'react-redux';
import * as Actions from '../store/actions';
import { AppState } from '../store';
import { FlatList, ScrollView } from 'react-native';
import { mergedMealSelector } from '../store/selectors';
import { DateChanger } from '../components/DateChanger';
import { MacroCard } from '../components/MacroCard';
import { nutritionColors } from '../common/theme';
import styled from 'styled-components/native';
import { MealListItem } from '../components/MealListItem';
import { FloatingButton } from '../components/FloatingButton';

const elements = [
  { name: 'carbs', title: 'Węgle', value: 19, percentages: 25 },
  { name: 'prots', title: 'Białka', value: 73, percentages: 63 },
  { name: 'fats', title: 'Tłuszcze', value: 281, percentages: 89 },
]

export const Home = () => {
  const [name, setName] = useState('Zupa');
  const dispatch = useDispatch();
  const [menuOpened, setMenuOpened] = useState(false);
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
    <ScrollView>
      <DateChanger date={new Date} />
      <MacroCards>
        {elements.map(element => (
          <MacroCard
            key={element.name}
            colors={(nutritionColors as any)[element.name]}
            percentages={element.percentages}
            title={element.title}
            value={element.value}
          />
        ))}
      </MacroCards>
      <FlatList
        data={mealsMerged}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <MealListItem
            meal={item}
            onMealToggle={mealId => dispatch(Actions.mealToggled(mealId))}
          />
        )}
      />
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
      <FloatingButton
        children="+"
        onPress={() => setMenuOpened(status => !status)}
      />
    </ScrollView>
  );
}

const MacroCards = styled.View`
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  margin-bottom: 50px;
`