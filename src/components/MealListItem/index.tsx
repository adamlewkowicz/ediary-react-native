import React from 'react';
import styled from 'styled-components/native';
import { Theme, nutritionColors } from '../../common/theme';
import { MacroElements } from '../../types';
import { ProgressBar } from '../ProgressBar';
import { MACRO_ELEMENTS } from '../../common/consts';
import { ProductPartial, ProductItem } from '../ProductItem';
import { FlatList, TouchableOpacity } from 'react-native';

interface MealListItemProps {
  meal: MealPartial
  onMealToggle: (mealId: MealPartial['id']) => void
}
export const MealListItem = (props: MealListItemProps) => (
  <Container>
    <TouchableOpacity onPress={() => props.onMealToggle(props.meal.id)}>
      <InfoContainer>
        <Title>{props.meal.name}</Title>
        <Calories>{props.meal.kcal} kcal</Calories>
      </InfoContainer>
      <NutritionBar>
        {MACRO_ELEMENTS.map(element => (
          element !== 'kcal' && (
            <NutritionStripe key={element}>
              <ProgressBar
                percentages={(props.meal as any)[`${element}Ratio`] || 0}
                colors={(nutritionColors as any)[element]}
                rounded={false}
                width="8px"
              />
            </NutritionStripe>
          )
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
          renderItem={({ item }) => (
            <ProductItem
              key={item.id}
              product={item}
            />
          )}
        />
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

const Calories = styled.Text`
  color: #6BB4DD;
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