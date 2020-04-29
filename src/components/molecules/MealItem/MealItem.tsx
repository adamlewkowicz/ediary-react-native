import React from 'react';
import styled from 'styled-components/native';
import { Theme } from '../../../common/theme';
import { MealItemDetails, MealItemDetailsProps } from './MealItemDetails';
import { MealItemInfo, MealItemContentProps } from './MealItemInfo';

export interface MealItemProps extends
  MealItemContentProps, 
  MealItemDetailsProps {}

export const MealItem = (props: MealItemProps) => (
  <Container
    isOpened={props.meal.isOpened}
    accessibilityLabel="Posiłek"
    accessibilityState={{ expanded: props.meal.isOpened }}
  >
    <MealItemInfo
      meal={props.meal}
      index={props.index}
      onMealOpen={props.onMealOpen}
      onMealDelete={props.onMealDelete}
    />
    {props.meal.isOpened && (
      <MealItemDetails
        meal={props.meal}
        onProductAdd={props.onProductAdd}
        onProductQuantityUpdate={props.onProductQuantityUpdate}
        onProductDelete={props.onProductDelete}
      />
    )}
  </Container>
);

const Container = styled.View<IsOpenedProp>`
  position: relative;
  background-color: ${props => props.theme.color[props.isOpened ? 'primary' : 'primaryLight']};
`

interface IsOpenedProp {
  isOpened?: boolean
  theme: Theme
}

export const MealItemMemo = React.memo(MealItem);