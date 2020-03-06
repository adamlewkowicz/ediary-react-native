import React from 'react';
import styled from 'styled-components/native';
import { theme } from '../common/theme';
import { MacroChart } from './MacroChart';

interface MacroChartsProps {
  values: readonly [number, number, number]
}

export const MacroCharts = (props: MacroChartsProps) => {
  return (
    <Container>
      <MacroChart
        title="Węglowodany"
        value={props.values[0]}
        percentages={25}
        gradientColors={theme.gradient.carbs}
      />
      <MacroChart
        title="Białko"
        value={props.values[1]}
        percentages={25}
        gradientColors={theme.gradient.prots}
      />
      <MacroChart
        title="Tłuszcze"
        value={props.values[2]}
        percentages={25}
        gradientColors={theme.gradient.fats}
      />
    </Container>
  );
}

const Container = styled.View`
  flex-direction: row;
  justify-content: space-around;
`