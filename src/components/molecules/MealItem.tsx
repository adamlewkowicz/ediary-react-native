import React from 'react';
import styled from 'styled-components/native';
import { H2, H4, TextHighlight } from '../';
import { ChartMacroCircles } from '..';
import { MealProductItemMemo } from './MealProductItem';
import { ButtonSecondary } from '../';
import { Selectors } from '../../store';
import { ChartMacroBarsBase } from './ChartMacroBarsBase';
import { ActivityIndicator } from 'react-native';
import { DiaryMeal, DiaryMealOrTemplate } from '../../store/reducers/diary';
import { MealId } from '../../types';
import { isDiaryMeal } from '../../store/reducers/diary/helpers';
import { Theme } from '../../common/theme';

interface MealItemProps<
  Meal extends Selectors.MealCalced,
  Product extends Meal['products'][number] = Meal['products'][number]
> {
  meal: Meal
  index: number
  onMealOpen: (meal: DiaryMealOrTemplate, index: number) => void
  onMealDelete: (meal: DiaryMeal) => void
  onProductAdd: (meal: Meal) => void
  onProductQuantityUpdate: (mealId: MealId, product: Product) => void
  onProductDelete: (mealId: MealId, product: Product) => void
}

export const MealItem = <T extends Selectors.MealCalced>(props: MealItemProps<T>) => {
  const { meal } = props;

  const handleMealOpen = (): void => {
    props.onMealOpen(meal, props.index);
  }

  const handleMealDelete = (): void => {
    if (isDiaryMeal(meal)) {
      props.onMealDelete(meal);
    }
  }

  const handleProductAdd = (): void => {
    props.onProductAdd(meal);
  }

  return (
    <Container
      isOpened={meal.isOpened}
      accessibilityLabel="Posiłek"
      accessibilityState={{ expanded: meal.isOpened }}
    >
      <InfoContainer
        onPress={handleMealOpen}
        onLongPress={__DEV__ ? undefined : handleMealDelete}
        isOpened={meal.isOpened}
        accessibilityLabel="Pokaż szczegóły lub usuń posiłek"
        accessibilityHint="Dotknij aby wyświetlić szczegóły posiłku, lub przytrzymaj aby go usunąć"
      >
        <MealTime>{meal.timeBase}</MealTime>
        <BaseInfo>
          <MealName isOpened={meal.isOpened}>
            {meal.data.name}
          </MealName>
          <Calories>
            {meal.calcedMacro.kcal.toFixed(0)} kcal
          </Calories>
        </BaseInfo>
        <ChartMacroBarsBase
          percentages={meal.macroPercentages}
        />
      </InfoContainer>
      {meal.isOpened && (
        <>
          <ChartsContainer>
            <ChartMacroCircles
              values={meal.calcedMacro}
              percentages={meal.macroPercentages}
            />
          </ChartsContainer>
          <ProductsContainer>
            {meal.products.map(product => (
              <MealProductItemMemo
                key={product.data.id}
                mealId={meal.data.id as MealId}
                product={product}
                onQuantityUpdate={props.onProductQuantityUpdate}
                onDelete={props.onProductDelete}
              />
            ))}
            {meal.isAddingProduct && (
              <Spinner
                accessibilityLabel="Trwa dodawanie produktu"
                size={25}
              />
            )}
            <AddProductButton
              accessibilityLabel="Dodaj produkt do posiłku"
              accessibilityHint="Przechodzi do wyszukiwarki produktów"
              role="link"
              onPress={handleProductAdd}
            >
              Dodaj produkt
            </AddProductButton>
          </ProductsContainer>
        </>
      )}
    </Container>
  );
}

const Calories = styled(TextHighlight)`
  color: ${props => props.theme.color.highlightSecondary};
`

const MealTime = H4;

const BaseInfo = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin: ${({ theme }) => `${theme.spacing.micro} 0px ${theme.spacing.tiny} 0px`};
`

const ChartsContainer = styled.View`
  padding: ${props => props.theme.spacing.smallHorizontal};
  border: ${props => `1px solid ${props.theme.color.quinary}`}; 
  background-color: ${props => props.theme.color.primary};
`

const ProductsContainer = styled.View`
  background-color: ${props => props.theme.color.primary};
  padding: ${props => props.theme.spacing.microXSmall};
  border-bottom-width: 1px;
  border-bottom-color: ${props => props.theme.color.tertiary};
`

const Spinner = styled(ActivityIndicator)`
  margin: ${props => props.theme.spacing.tinyVertical};
`

const AddProductButton = styled(ButtonSecondary)`
  margin: ${props => props.theme.spacing.smallVertical};
`

const Container = styled.View<IsOpenedProp>`
  position: relative;
  background-color: ${props => props.theme.color[props.isOpened ? 'primary' : 'primaryLight']};
`

const InfoContainer = styled.TouchableOpacity<IsOpenedProp>`
  padding: ${props => props.theme.spacing.baseXSmall};
  background-color: ${props => props.theme.color[props.isOpened ? 'primary' : 'primaryLight']};
`

// @ts-ignore
const MealName = styled<IsOpenedProp>(H2)`
  color: ${(props: IsOpenedProp) => props.theme.color[props.isOpened ? 'primaryLight' : 'primary']};
`

interface IsOpenedProp {
  isOpened?: boolean
  theme: Theme
}

export const MealItemMemo = React.memo(MealItem);