import React from 'react';
import styled from 'styled-components/native';
import { Theme, nutritionColors } from '../../common/theme';
import { MacroElements, ProductId, MealId } from '../../types';
import { ProgressBar } from '../ProgressBar';
import { ProductPartial, ProductItem } from '../ProductItem';
import { FlatList, TouchableOpacity, TouchableOpacityProps } from 'react-native';
import { MealsWithRatio } from '../../store/selectors';
import { Button } from 'react-native-ui-kitten';

interface MealListItemProps {
  meal: MealsWithRatio[number]
  onToggle: (mealId: MealId) => void
  onLongPress?: TouchableOpacityProps['onLongPress']
  onProductAdd: () => void
  onProductDelete: (productId: ProductId) => void
  onProductToggle: (productId: ProductId) => void
  onProductQuantityUpdate: (productId: ProductId, quantity: number) => void
  toggledProductId: ProductId | null
}
export const MealListItem = (props: MealListItemProps) => (
  <Container>
    <TouchableOpacity
      onPress={() => props.onToggle(props.meal.id)}
      onLongPress={props.onLongPress}
      accessibilityLabel="Pokaż szczegóły posiłku"
      accessibilityHint={`Wyświetla makroskładniki or produkty posiłku - ${props.meal.name}`}
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
          <NutritionElement>
            <NutritionValue>{props.meal.carbs}g</NutritionValue>
            <NutritionTitle>Węgle</NutritionTitle>
          </NutritionElement>
          <NutritionElement>
            <NutritionValue>{props.meal.prots}g</NutritionValue>
            <NutritionTitle>Białka</NutritionTitle>
          </NutritionElement>
          <NutritionElement>
            <NutritionValue>{props.meal.fats}g</NutritionValue>
            <NutritionTitle>Tłuszcze</NutritionTitle>
          </NutritionElement>
        </NutritionDetails>
        <FlatList
          data={props.meal.products}
          keyExtractor={item => item.id.toString()}
          renderItem={({ item }) => (
            <ProductItem
              key={item.id}
              product={item}
              onDelete={props.onProductDelete}
              onToggle={props.onProductToggle}
              onQuantityUpdate={props.onProductQuantityUpdate}
              isToggled={props.toggledProductId === item.id}
            />
          )}
        />
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

const Container = styled.View`
`

const InfoContainer = styled.View`
  padding: 20px;
  display: flex;
  flex-direction: row;
  justify-content:  space-between;
  align-items: center;
`

const Title = styled.Text<{
  theme: Theme
}>`
  font-family: 'DMSans-Bold';
  font-size: 15px;
`

const Calories = styled.Text<{
  theme: Theme
}>`
  font-family: ${props => props.theme.fontFamily};
  color: ${props => props.theme.colors.lightBlue};
  font-size: 15px;
`

const NutritionBar = styled.View`
  display: flex;
  flex-direction: row;
  align-items: center;
`

const NutritionStripe = styled.View`
  width: 33%;
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

const NutritionValue = styled.Text<{
  theme: Theme
}>`
  font-family: ${props => props.theme.fontFamily};
  color: #fff;
  text-align: center;
  font-size: 15px;
  margin-bottom: 2px;
`

const NutritionTitle = styled.Text<{
  theme: Theme
}>`
  font-family: ${props => props.theme.fontFamily};
  color: #646464;
  text-align: center;
`

interface MealPartial extends MacroElements {
  id: number
  name: string
  carbsRatio?: number
  protsRatio?: number
  fatsRatio?: number
  isToggled: boolean
  products: ProductPartial[]
}