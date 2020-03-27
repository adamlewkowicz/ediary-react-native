import React from 'react';
import styled from 'styled-components/native';
import { ChartProgressBar } from '../';
import { theme } from '../../common/theme';
import { BaseMacroElements } from '../../types';

interface ChartMacroBarsBaseProps {
  percentages: BaseMacroElements
}

export const ChartMacroBarsBase = (props: ChartMacroBarsBaseProps) => {
  return (
    <Container>
      <ChartProgressBar
        percentage={props.percentages.carbs}
        gradientColors={theme.gradient.carbs}
      />
      <ChartProgressBar
        percentage={props.percentages.prots}
        gradientColors={theme.gradient.prots}
      />
      <ChartProgressBar
        percentage={props.percentages.fats}
        gradientColors={theme.gradient.fats}
      />
    </Container>
  );
}

const Container = styled.View`
  flex-direction: row;
`