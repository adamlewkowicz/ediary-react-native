import React from 'react';
import styled from 'styled-components/native';
import { ChartProgressBar } from '../';
import { THEME } from '../../common/theme';
import { BaseMacroElements } from '../../types';

interface ChartMacroBarsBaseProps {
  percentages: BaseMacroElements
}

export const ChartMacroBarsBase = (props: ChartMacroBarsBaseProps) => {
  return (
    <Container>
      <ChartProgressBar
        percentage={props.percentages.carbs}
        gradientColors={THEME.gradient.carbs}
      />
      <ChartProgressBar
        percentage={props.percentages.prots}
        gradientColors={THEME.gradient.prots}
      />
      <ChartProgressBar
        percentage={props.percentages.fats}
        gradientColors={THEME.gradient.fats}
      />
    </Container>
  );
}

const Container = styled.View`
  flex-direction: row;
`