import React from 'react';
import styled from 'styled-components/native';
import { theme } from '../../common/theme';
import { ChartMacroCircle } from '../molecules/ChartMacroCircle';

interface ChartMacroCirclesProps {
  /** `[carbs, prots, fats]` */
  values: readonly [number, number, number]
  /** `[carbs, prots, fats]` */
  percentages: readonly [number, number, number]
  /** `[carbs, prots, fats]` */
  valuesLeft?: readonly [number, number, number]
}

export const ChartMacroCircles = (props: ChartMacroCirclesProps) => {
  return (
    <Container>
      <ChartMacroCircle
        title="Węglowodany (g)"
        value={props.values[0]}
        valueLeft={props.valuesLeft?.[0]}
        percentages={props.percentages[0]}
        gradientColors={theme.gradient.carbs}
      />
      <ChartMacroCircle
        title="Białko (g)"
        value={props.values[1]}
        valueLeft={props.valuesLeft?.[1]}
        percentages={props.percentages[1]}
        gradientColors={theme.gradient.prots}
      />
      <ChartMacroCircle
        title="Tłuszcze (g)"
        value={props.values[2]}
        valueLeft={props.valuesLeft?.[2]}
        percentages={props.percentages[2]}
        gradientColors={theme.gradient.fats}
      />
    </Container>
  );
}

const Container = styled.View`
  flex-direction: row;
  justify-content: space-around;
  margin: ${props => props.theme.spacing.secondary}px;
`