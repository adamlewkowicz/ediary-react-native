import React from 'react';
import styled from 'styled-components/native';
import { ProgressBar } from '../../components/ProgressBar';
import { theme } from '../../common/theme';
import { BaseMacroElements } from '../../types';

interface ChartMacroBarsBaseProps {
  percentages: BaseMacroElements
}

export const ChartMacroBarsBase = (props: ChartMacroBarsBaseProps) => {
  return (
    <Container>
      <ProgressBar
        percentages={props.percentages.carbs}
        colors={theme.gradient.carbs}
      />
      <ProgressBar
        percentages={props.percentages.prots}
        colors={theme.gradient.prots}
      />
      <ProgressBar
        percentages={props.percentages.fats}
        colors={theme.gradient.fats}
      />
    </Container>
  );
}

const Container = styled.View`
  flex-direction: row;
`