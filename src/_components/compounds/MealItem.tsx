import React from 'react';
import styled from 'styled-components/native';
import { H2, H4, TextHighlight } from '../atoms/Text';
import { ButtonReveal, ChartMacroCircles } from '../../_components';
import { MealProductItem } from './MealProductItem';
import { ButtonSecondary } from '../molecules/_index';
import { Selectors } from '../../store';
import { ChartMacroBarsBase } from './ChartMacroBarsBase';

interface MealItemProps<
  Meal extends Selectors.MealWithRatio,
  Product extends Meal['products'][number] = Meal['products'][number]
> {
  isOpened?: boolean
  meal: Meal
  onMealPress?: (mealId: Meal['id']) => void
  onProductAdd?: (meal: Meal) => void
  onProductPress?: (mealId: Meal['id'], product: Product) => void
}

export const MealItem = <T extends Selectors.MealWithRatio>(props: MealItemProps<T>) => {
  const handleMealPress = () => {
    props.onMealPress?.(props.meal.id);
  }

  return (
    <Container isOpened={props.meal.isToggled}>
      <InfoContainer
        onPress={handleMealPress}
        isOpened={props.meal.isToggled}
      >
        <Time>{props.meal.dateTimeBase}</Time>
        <BaseInfo>
          <MealName isOpened={props.meal.isToggled}>{props.meal.name}</MealName>
          <Calories>{props.meal.calcedMacro.kcal} kcal</Calories>
        </BaseInfo>
        <ChartMacroBarsBase
          percentages={props.meal.macroPercentages}
        />
      </InfoContainer>
      {props.meal.isToggled && (
        <>
          {/* <RevealMealButton onPress={handleMealPress} /> */}
          <ChartsContainer>
            <ChartMacroCircles
              values={[
                props.meal.calcedMacro.carbs,
                props.meal.calcedMacro.prots,
                props.meal.calcedMacro.fats,
              ]}
              percentages={[
                props.meal.macroPercentages.carbs,
                props.meal.macroPercentages.prots,
                props.meal.macroPercentages.fats,
              ]}
            />
          </ChartsContainer>
          <ProductsContainer>
            {props.meal.products.map(product => (
              <MealProductItem
                key={product.id}
                name={product.name}
                quantity={product.quantity}
                kcal={product.calcedMacro.kcal}
                onPress={() => props.onProductPress?.(props.meal.id, product)}
              />
            ))}
            <AddProductButton
              onPress={() => props.onProductAdd?.(props.meal)}
            >
              Dodaj produkt
            </AddProductButton>
          </ProductsContainer>
        </>
      )}
    </Container>
  );
}

export const MealItemSeparator = styled.View`
  height: 1px;
  background-color: ${props => props.theme.color.quaternary};
`

const Calories = styled(TextHighlight)`
  color: ${props => props.theme.color.highlightSecondary};
`

const Time = styled(H4)``

const BaseInfo = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin: 5px 0 10px 0;
`

const ChartsContainer = styled.View`
  padding: 0 20px;
  border: ${props => `1px solid ${props.theme.color.quinary}`}; 
  background-color: ${props => props.theme.color.primary};
`

// TODO: HARDOCDED COLOR
const ProductsContainer = styled.View`
  background-color: ${props => props.theme.color.primary};
  padding: 5px 15px;
  border-bottom-width: 1px;
  border-bottom-color: ${props => props.theme.color.tertiary};
`

const RevealMealButton = styled(ButtonReveal)`
  position: absolute;
  top: 70px;
  z-index: 200;
`

const AddProductButton = styled(ButtonSecondary)`
  margin: 20px 0;
`

interface IsOpenedProp {
  isOpened?: boolean
}

const Container = styled.View<IsOpenedProp>`
  position: relative;
  background-color: ${props => props.isOpened ? props.theme.color.primary : '#fff'};
`

const InfoContainer = styled.TouchableOpacity<IsOpenedProp>`
  padding: ${props => props.theme.spacing.screenPadding};
  background-color: ${props => props.isOpened ? props.theme.color.primary : '#fff'};
`

// @ts-ignore
const MealName = styled<IsOpenedProp>(H2)`
  color: ${props => props.isOpened ? '#fff' : props.theme.color.primary};
`