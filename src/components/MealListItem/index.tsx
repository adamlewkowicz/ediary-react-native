import React from 'react';
import styled from 'styled-components/native';
import { nutritionColors } from '../../common/theme';
import { ProductId } from '../../types';
import { ProgressBar } from '../ProgressBar';
import { ProductItem } from '../ProductItem';
import { FlatList, TouchableOpacity, TouchableOpacityProps } from 'react-native';
import { MealsWithRatio } from '../../store/selectors';
import { Button } from 'react-native-ui-kitten';
import { BASE_MACRO_ELEMENTS } from '../../common/consts';
import { elementTitles } from '../../common/helpers';
import { DiaryMealId } from '../../store/reducers/diary';

interface MealListItemProps {
  meal: MealsWithRatio[number]
  onToggle: (mealId: DiaryMealId) => void
  onLongPress?: TouchableOpacityProps['onLongPress']
  onProductAdd: () => void
  onProductDelete?: (productId: ProductId) => void
  onProductToggle?: (productId: ProductId) => void
  onProductQuantityUpdate?: (productId: ProductId, quantity: number) => void
  toggledProductId: ProductId | null
  isBeingProcessed: boolean
}
export const MealListItem = ({
  onProductDelete = () => {},
  onProductToggle = () => {},
  onProductQuantityUpdate = () => {},
  ...props
}: MealListItemProps) => (
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
              colors={nutritionColors[ratio.element]}
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
              <NutritionTitle>{elementTitles[element]}</NutritionTitle>
            </NutritionElement>
          ))}
        </NutritionDetails>
        <FlatList
          data={props.meal.products}
          keyExtractor={item => item.id.toString()}
          renderItem={({ item }) => (
            <ProductItem
              key={item.id}
              product={item}
              onDelete={onProductDelete}
              onToggle={onProductToggle}
              onQuantityUpdate={onProductQuantityUpdate}
              isToggled={props.toggledProductId === item.id}
            />
          )}
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
  font-family: ${props => props.theme.font.bold};
  font-size: ${props => props.theme.font.size};
`

const Calories = styled.Text`
  font-family: ${props => props.theme.font.regular};
  color: ${props => props.theme.colors.lightBlue};
  font-size: ${props => props.theme.font.size};
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
  padding: 10px;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
`

const NutritionElement = styled.View`
`

const NutritionValue = styled.Text`
  font-family: ${props => props.theme.font.regular};
  font-size: ${props => props.theme.font.size};
  color: #fff;
  text-align: center;
  margin-bottom: 4px;
`

const NutritionTitle = styled.Text`
  font-family: ${props => props.theme.font.regular};
  font-size: 12px;
  color: #646464;
  text-align: center;
`

const Spinner = styled.ActivityIndicator`
  margin-vertical: 10px;
`