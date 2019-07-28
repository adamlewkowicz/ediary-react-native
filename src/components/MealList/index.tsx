import React from 'react';
import styled from 'styled-components/native';
import { CalcedMealSelectorResult } from '../../store/selectors';
import { ArrayElement } from '../../types';
import { List, ListItem, Button } from 'react-native-ui-kitten';
import { useDispatch } from 'react-redux';
import * as Actions from '../../store/actions';

interface MealListProps {
  meals: CalcedMealSelectorResult
}
export const MealList = ({ meals }: MealListProps) => {
  const dispatch = useDispatch();

  function handleMealToggle(meal: ArrayElement<CalcedMealSelectorResult>) {
    dispatch(Actions.mealToggled(meal.id));
  }

  return (
    <List
      data={meals}
      renderItem={(info: any) => (
        <MealListItem
          meal={info.item}
          onPress={() => handleMealToggle(info.item)}
        />
      )}
    />
  );
}


interface MealListItemProps {
  meal: ArrayElement<CalcedMealSelectorResult>
  onPress?: () => any
}
export const MealListItem = ({ meal, onPress }: MealListItemProps) => {
  return (
    <ListItem
      title={meal.name}
      description={`Kalorie: ${meal.kcal}`}
      onPress={onPress}
      accessory={() => (
        <Button>
          +
        </Button>
      )}
    />
  );
}

const Container = styled.View`
  
`