import React from 'react';
import styled from 'styled-components/native';
import { H2, H4, TextHighlight } from '../atoms/Text';
import { ButtonReveal, ChartMacroCircles } from '../../_components';
import { MealProductItem } from './MealProductItem';
import { ButtonSecondary } from '../molecules/_index';
import { Selectors } from '../../store';
import { ChartMacroBarsBase } from './ChartMacroBarsBase';
import { layoutAnimateEase } from '../../common/utils';

interface MealItemProps<
  Meal extends Selectors.MealWithRatio,
  Product extends Meal['products'][number] = Meal['products'][number]
> {
  isOpened?: boolean
  meal: Meal
  onMealPressed?: (mealId: Meal['id']) => void
  onProductAdd?: (meal: Meal) => void
  onProductPressed?: (productId: Product['id']) => void
}

export const MealItem = <T extends Selectors.MealWithRatio>(props: MealItemProps<T>) => {
  const handleMealPress = () => {
    props.onMealPressed?.(props.meal.id);
  }

  return (
    <Container>
      <InfoContainer
        onPress={handleMealPress}
        isOpened={props.meal.isToggled}
      >
        <Time>14:00</Time>
        <BaseInfo>
          <MealName isOpened={props.meal.isToggled}>{props.meal.name}</MealName>
          <Calories>{props.meal.macro.kcal} kcal</Calories>
        </BaseInfo>
        <ChartMacroBarsBase
          percentages={[
            12,
            33,
            84,
          ]}
        />
      </InfoContainer>
      {props.meal.isToggled && (
        <>
          <RevealMealButton onPress={handleMealPress} />
          <ChartsContainer>
            <ChartMacroCircles
              values={[14, 68, 47]}
              percentages={[14, 68, 47]}
            />
          </ChartsContainer>
          <ProductsContainer>
            {props.meal.products.map(product => (
              <MealProductItem
                onPress={() => props.onProductPressed?.(product.id)}
              />
            ))}
            <MealProductItem />
            <MealProductItem />
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

interface IsOpenedProp {
  isOpened?: boolean
}

const InfoContainer = styled.TouchableOpacity<IsOpenedProp>`
  padding: ${props => props.theme.spacing.screenPadding};
  background-color: ${props => props.isOpened ? props.theme.color.primary : '#fff'}
`

const Calories = styled(TextHighlight)`
  color: ${props => props.theme.color.highlightSecondary};
`

const MealName = styled<IsOpenedProp>(H2)`
  color: ${props => props.isOpened ? '#fff' : props.theme.color.primary}
`

const Time = styled(H4)`
`

const Container = styled.View`
  position: relative;
`

const BaseInfo = styled.View`
  /* padding: 10px 0; */
  /* background: red; */
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin: 5px 0 10px 0;
`

const ChartsContainer = styled.View`
  padding: 40px 10px 20px 10px;
  border: ${props => `1px solid ${props.theme.color.tertiary}`}; 
  background-color: ${props => props.theme.color.primary};
`

// TODO: HARDOCDED COLOR
const ProductsContainer = styled.View`
  background-color: #FAFBFF;
  padding: 5px 15px;
  border-bottom-width: 1px;
  border-bottom-color: ${props => props.theme.color.tertiary};
`

const RevealMealButton = styled(ButtonReveal)`
  position: absolute;
  top: 60px;
  z-index: 200;
`

const AddProductButton = styled(ButtonSecondary)`
  margin: 20px 0;
`