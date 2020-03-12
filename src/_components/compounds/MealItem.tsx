import React from 'react';
import styled from 'styled-components/native';
import { H2, H4, TextHighlight } from '../atoms/Text';
import { ProgressBar } from '../../components/ProgressBar';
import { theme } from '../../common/theme';
import { ButtonReveal, ChartMacroCircles } from '../../_components';
import { MealProductItem } from './MealProductItem';
import { ButtonSecondary } from '../molecules/_index';
import { Selectors } from '../../store';

interface MealItemProps<
  T extends Selectors.MealWithRatio,
  P extends T['products'][number] = T['products'][number]
> {
  isOpened?: boolean
  meal: T
  onMealPressed?: (mealId: T['id']) => void
  onProductAdd?: (meal: T) => void
  onProductPressed?: (productId: P['id']) => void
}

export const MealItem = <T extends Selectors.MealWithRatio>(props: MealItemProps<T>) => {
  const handleMealPress = () => props.onMealPressed?.(props.meal.id);

  return (
    <Container>
      <InfoContainer onPress={handleMealPress}>
        <Heading>
          <BaseInfo>
            <Time>14:00</Time>
            <H2>{props.meal.name}</H2>
          </BaseInfo>
          <TextHighlight>{props.meal.macro.kcal} kcal</TextHighlight>
        </Heading>
        <ProgressBar
          percentages={41}
          colors={theme.gradient.kcal}
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

const InfoContainer = styled.TouchableOpacity`
  padding: 10px;
`

const Time = styled(H4)`
  margin-bottom: 2px;
`

const Container = styled.View`
  /* padding: 15px; */
  margin: 20px 0;

  /* background: blue; */
  position: relative;
`

const Heading = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 5px;
  align-items: center;
  /* padding: 0 10px; */
`

const BaseInfo = styled.View``

const ChartsContainer = styled.View`
  margin-top: 40px;
  padding: 40px 10px 20px 10px;
  border: ${props => `1px solid ${props.theme.color.tertiary}`}; 
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

type MealId = Selectors.MealWithRatio['id'];