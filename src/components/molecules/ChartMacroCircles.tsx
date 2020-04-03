import React from 'react';
import styled from 'styled-components/native';
import { theme } from '../../common/theme';
import { ChartMacroCircle } from '../';
import { BaseMacroElements } from '../../types';

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
      gradientColors={theme.gradient.carbs}
    />
    <ChartMacroCircle
      title="Białko"
      value={props.values.prots}
      percentage={props.percentages.prots}
      gradientColors={theme.gradient.prots}
    />
    <ChartMacroCircle
      title="Tłuszcze"
      value={props.values.fats}
      percentage={props.percentages.fats}
      gradientColors={theme.gradient.fats}
    />
  </Container>
);

const Container = styled.View`
  flex-direction: row;
  justify-content: space-around;
  padding: ${props => props.theme.spacing.smallHorizontal};
  margin: ${props => props.theme.spacing.smallVertical};
`