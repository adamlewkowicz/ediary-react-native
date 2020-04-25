import React from 'react';
import styled from 'styled-components/native';
import { DiaryMeal, DiaryMealOrTemplate } from '../../../store/reducers/diary';
import { H4, TextHighlight, H2 } from '../../atoms';
import { ChartMacroBarsBase } from '../ChartMacroBarsBase';
import { Selectors } from '../../../store';
import { Theme } from '../../../common/theme';
import { isDiaryMeal } from '../../../store/reducers/diary/helpers';

export interface MealItemContentProps {
  index: number
  meal: Selectors.MealCalced
  onMealOpen: (meal: DiaryMealOrTemplate, index: number) => void
  onMealDelete: (meal: DiaryMeal) => void
}

export const MealItemInfo = (props: MealItemContentProps) => {

  const handleMealDelete = (): void => {
    if (isDiaryMeal(props.meal)) {
      props.onMealDelete(props.meal);
    }
  }

  return (
    <Container
      onPress={() => props.onMealOpen(props.meal, props.index)}
      onLongPress={__DEV__ ? undefined : handleMealDelete}
      isOpened={props.meal.isOpened}
      accessibilityLabel="Pokaż szczegóły lub usuń posiłek"
      accessibilityHint="Dotknij aby wyświetlić szczegóły posiłku, lub przytrzymaj aby go usunąć"
    >
      <MealTime>{props.meal.timeBase}</MealTime>
      <BaseInfo>
        <MealName isOpened={props.meal.isOpened}>
          {props.meal.data.name}
        </MealName>
        <Calories>
          {props.meal.calcedMacro.kcal.toFixed(0)} kcal
        </Calories>
      </BaseInfo>
      <ChartMacroBarsBase
        percentages={props.meal.macroPercentages}
      />
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

const Container = styled.TouchableOpacity<IsOpenedProp>`
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