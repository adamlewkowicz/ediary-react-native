import React from 'react';
import styled from 'styled-components/native';
import { THEME } from '../../../common/theme';
import { ChartMacroCircle } from '../..';
import { BaseMacroElements } from '../../../types';

interface ChartMacroCirclesProps {
  values: BaseMacroElements
  percentages: BaseMacroElements
}

export const ChartMacroCircles = (props: ChartMacroCirclesProps) => (
  <Container>
    <ChartMacroCircle
      title="Węglowodany"
      value={props.values.carbs}
      percentage={props.percentages.carbs}
      gradientColors={THEME.gradient.carbs}
    />
    <ChartMacroCircle
      title="Białko"
      value={props.values.prots}
      percentage={props.percentages.prots}
      gradientColors={THEME.gradient.prots}
    />
    <ChartMacroCircle
      title="Tłuszcze"
      value={props.values.fats}
      percentage={props.percentages.fats}
      gradientColors={THEME.gradient.fats}
    />
  </Container>
);

const Container = styled.View`
  flex-direction: row;
  justify-content: space-around;
  padding: ${props => props.theme.spacing.smallHorizontal};
  margin: ${props => props.theme.spacing.smallVertical};
`