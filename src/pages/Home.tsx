import React, { useState, useEffect } from 'react';
import { Button } from 'react-native-ui-kitten';
import { useDispatch, connect } from 'react-redux';
import * as Actions from '../store/actions';
import { AppState } from '../store';
import { FlatList, ScrollView } from 'react-native';
import { mealsWithRatio, MealsWithRatio } from '../store/selectors';
import { DateChanger } from '../components/DateChanger';
import { MacroCard } from '../components/MacroCard';
import { nutritionColors } from '../common/theme';
import styled from 'styled-components/native';
import { MealListItem } from '../components/MealListItem';
import { FloatingButton } from '../components/FloatingButton';
import { BasicInput } from '../components/BasicInput';

const elements = [
  { name: 'carbs', title: 'Węgle', value: 19, percentages: 25 },
  { name: 'prots', title: 'Białka', value: 73, percentages: 63 },
  { name: 'fats', title: 'Tłuszcze', value: 281, percentages: 89 },
]

interface HomeProps {
  mealsWithRatio: MealsWithRatio
  appDate: AppState['application']['date']
}
const Home = (props: HomeProps) => {
  const [name, setName] = useState('Zupa');
  const [menuOpened, setMenuOpened] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(Actions.mealsFindByDay())
  }, []);
  
  return (
    <Container>
      <FloatingButton
        children="+"
        onPress={() => setMenuOpened(status => !status)}
      />
      <ScrollView>
        <DateChanger date={props.appDate} />
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
          data={props.mealsWithRatio}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <MealListItem
              meal={item}
              onToggle={mealId => dispatch(Actions.mealToggled(mealId))}
            />
          )}
        />
        <BasicInput
          label="Nazwa posiłku"
          value={name}
          onChangeText={name => setName(name)}
        />
        <Button onPress={() => dispatch(Actions.mealCreate(name))}>
          Dodaj posiłek
        </Button>
        <Button onPress={() => dispatch(Actions.mealProductCreate(
          props.mealsWithRatio[0].id,
          { name } as any
        ))}>
          Dodaj produkt (Pierwszy posiłek)
        </Button>
        <Button onPress={() => dispatch(Actions.productUpdate(
          props.mealsWithRatio[0].products[0].id,
          { name }
        ))}>
          Aktualizuj nazwę (Pierwszy produkt)
        </Button>
      </ScrollView>
    </Container>
  );
}

const HomeConnected = connect(
  (state: AppState) => ({
    mealsWithRatio: mealsWithRatio(state),
    appDate: state.application.date
  }),
  (dispatch) => ({ dispatch })
)(Home);

const Container = styled.View`
  display: flex;
  min-height: 100%;
`

const MacroCards = styled.View`
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  margin-bottom: 50px;
`

export { HomeConnected as Home };