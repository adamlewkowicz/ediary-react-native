import React from 'react';
import styled from 'styled-components/native';
import { ProgressBar } from '../../components/ProgressBar';
import { theme } from '../../common/theme';

interface ChartMacroBarsBaseProps {
  /** `[carbs, prots, fats]` */
  percentages: readonly [number, number, number]
}

export const ChartMacroBarsBase = (props: ChartMacroBarsBaseProps) => {
  const [carbs, prots, fats] = props.percentages;

  return (
    <Container>
      <ProgressBar
        percentages={carbs}
        colors={theme.gradient.carbs}
      />
      <ProgressBar
        percentages={prots}
        colors={theme.gradient.prots}
      />
      <ProgressBar
        percentages={fats}
        colors={theme.gradient.fats}
      />
    </Container>
  );
}

const Container = styled.View`
  flex-direction: row;
`