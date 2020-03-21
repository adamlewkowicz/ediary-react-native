import React from 'react';
import styled from 'styled-components/native';
import { H2, H4, TextHighlight } from '../atoms/Text';
import { ButtonReveal, ChartMacroCircles } from '../../_components';
import { MealProductItem } from './MealProductItem';
import { ButtonSecondary } from '../molecules/_index';
import { Selectors } from '../../store';
import { ChartMacroBarsBase } from './ChartMacroBarsBase';
import { ActivityIndicator } from 'react-native';
import { DiaryMeal, DiaryMealOrTemplateId } from '../../store/reducers/diary';
import { MealId } from '../../types';
import { isDiaryMeal } from '../../store/reducers/diary/helpers';

interface MealItemProps<
  Meal extends Selectors.MealCalced,
  Product extends Meal['products'][number] = Meal['products'][number]
> {
  meal: Meal
  onMealOpen: (mealId: DiaryMealOrTemplateId) => void
  onMealDelete: (meal: DiaryMeal) => void
  onProductAdd: (meal: Meal) => void
  onProductQuantityUpdate: (mealId: MealId, product: Product) => void
  onProductDelete: (mealId: MealId, product: Product) => void
}

export const MealItem = <T extends Selectors.MealCalced>(props: MealItemProps<T>) => {

  const handleMealPress = (): void => {
    props.onMealOpen(props.meal.data.id);
  }

  const handleMealDelete = (): void => {
    if (isDiaryMeal(props.meal)) {
      props.onMealDelete(props.meal);
    }
  }

  return (
    <Container isOpened={props.meal.isOpened}>
      <InfoContainer
        onPress={handleMealPress}
        onLongPress={__DEV__ ? undefined : handleMealDelete}
        isOpened={props.meal.isOpened}
      >
        <Time>{props.meal.dateTimeBase}</Time>
        <BaseInfo>
          <MealName isOpened={props.meal.isOpened}>
            {props.meal.data.name}
          </MealName>
          <Calories>{props.meal.calcedMacro.kcal.toFixed(0)} kcal</Calories>
        </BaseInfo>
        <ChartMacroBarsBase
          percentages={props.meal.macroPercentages}
        />
      </InfoContainer>
      {props.meal.isOpened && (
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
                key={product.data.id}
                name={product.data.name}
                quantity={product.quantity}
                kcal={product.calcedMacro.kcal}
                onPress={() => props.onProductQuantityUpdate(
                  props.meal.data.id as MealId,
                  product
                )}
                onDelete={() => props.onProductDelete(
                  props.meal.data.id as MealId,
                  product
                )}
              />
            ))}
            {props.meal.isAddingProduct && <Spinner size={25} />}
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

const Spinner = styled(ActivityIndicator)`
  margin: 10px 0;
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