import React from 'react';
import styled from 'styled-components/native';
import { ProgressBar } from '../ProgressBar';
import { FlatList, TouchableOpacity, TouchableOpacityProps } from 'react-native';
import { MealsWithRatio } from '../../store/selectors';
import { Button } from 'react-native-ui-kitten';
import { BASE_MACRO_ELEMENTS } from '../../common/consts';
import { elementTitlesLong } from '../../common/helpers';
import { DiaryMealId } from '../../store/reducers/diary';
import { theme } from '../../common/theme';

interface MealListItemProps {
  meal: MealsWithRatio[number]
  onToggle: (mealId: DiaryMealId) => void
  onLongPress: TouchableOpacityProps['onLongPress']
  isBeingProcessed: boolean
  onProductAdd: () => void
  renderProduct: (
    product: MealsWithRatio[number]['products'][number]
  ) => JSX.Element | null
}

export const MealListItem = (props: MealListItemProps) => (
  <Container>
    <TouchableOpacity
      onPress={() => props.onToggle(props.meal.id)}
      onLongPress={props.onLongPress}
      accessibilityLabel="Pokaż szczegóły posiłku"
      accessibilityHint={`Wyświetla makroskładniki i produkty posiłku - ${props.meal.name}`}
      accessibilityRole="radio"
    >
      <InfoContainer>
        <Title numberOfLines={1}>{props.meal.name}</Title>
        <Calories>{props.meal.kcal} kcal</Calories>
      </InfoContainer>
      <NutritionBar>
        {props.meal.macroRatio.map(ratio => (
          <NutritionStripe key={ratio.element}>
            <ProgressBar
              percentages={ratio.value * 100}
              colors={theme.gradient[ratio.element]}
              rounded={false}
              width="8px"
            />
          </NutritionStripe>
        ))}
      </NutritionBar>
    </TouchableOpacity>
    {props.meal.isToggled && (
      <>
        <NutritionDetails>
          {BASE_MACRO_ELEMENTS.map(element => (
            <NutritionElement key={element}>
              <NutritionValue>{props.meal[element]}g</NutritionValue>
              <NutritionTitle>{elementTitlesLong[element]}</NutritionTitle>
            </NutritionElement>
          ))}
        </NutritionDetails>
        <FlatList
          data={props.meal.products}
          keyExtractor={item => item.id.toString()}
          renderItem={({ item }) => props.renderProduct(item)}
        />
        {props.isBeingProcessed && <Spinner />}
        <Button
          onPress={props.onProductAdd}
          accessibilityLabel="Wyszukaj produkt do posiłku"
          accessibilityRole="link"
        >
          Dodaj produkt
        </Button>
      </>
    )}
  </Container>
);

const Container = styled.View``

const InfoContainer = styled.View`
  padding: 20px;
  display: flex;
  flex-direction: row;
  justify-content:  space-between;
  align-items: center;
`

const Title = styled.Text`
  font-family: ${props => props.theme.fontWeight.bold};
  font-size: ${props => props.theme.fontSize.regular};
`

const Calories = styled.Text`
  font-family: ${props => props.theme.fontWeight.regular};
  color: ${props => props.theme.color.blue20};
  font-size: ${props => props.theme.fontSize.regular};
`

const NutritionBar = styled.View`
  display: flex;
  flex-direction: row;
  align-items: center;
`

const NutritionStripe = styled.View`
  flex: 1;
`

const NutritionDetails = styled.View`
  background: #313131;
  padding: 10px 0;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
`

const NutritionElement = styled.View`
  flex: 1;
`

const NutritionValue = styled.Text`
  font-family: ${props => props.theme.fontWeight.regular};
  font-size: ${props => props.theme.fontSize.regular};
  color: #fff;
  text-align: center;
  margin-bottom: 4px;
`

const NutritionTitle = styled.Text`
  font-family: ${props => props.theme.fontWeight.regular};
  font-size: ${props => props.theme.fontSize.small};
  color: ${props => props.theme.color.gray40};
  text-align: center;
`

const Spinner = styled.ActivityIndicator`
  margin-vertical: 10px;
`