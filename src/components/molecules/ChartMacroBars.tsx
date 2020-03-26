import React from 'react';
import { ChartMacroBar } from '../';
import { theme } from '../../common/theme';
import styled from 'styled-components/native';

interface ChartMacroBarsProps {
  /** `[carbs, prots, fats, kcal]` */
  percentages: readonly [number, number, number, number]
}

export const ChartMacroBars = (props: ChartMacroBarsProps) => {
  const [carbs, prots, fats, kcal] = props.percentages;

  return (
    <Container>
      <ChartMacroBar
        title="Węglowodany"
        percentages={carbs}
        colors={theme.gradient.carbs}
      />
      <ChartMacroBar
        title="Białko"
        percentages={prots}
        colors={theme.gradient.prots}
      />
      <ChartMacroBar
        title="Tłuszcze"
        percentages={fats}
        colors={theme.gradient.fats}
      />
      <ChartMacroBar
        title="Kalorie"
        percentages={kcal}
        colors={theme.gradient.kcal}
      />
    </Container>
  );
}

const Container = styled.View`
  
`