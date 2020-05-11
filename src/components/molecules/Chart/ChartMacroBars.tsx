import React from 'react';
import { ChartMacroBar } from '../..';
import { THEME } from '../../../common/theme';
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
        percentage={carbs}
        gradientColors={THEME.gradient.carbs}
      />
      <ChartMacroBar
        title="Białko"
        percentage={prots}
        gradientColors={THEME.gradient.prots}
      />
      <ChartMacroBar
        title="Tłuszcze"
        percentage={fats}
        gradientColors={THEME.gradient.fats}
      />
      <ChartMacroBar
        title="Kalorie"
        percentage={kcal}
        gradientColors={THEME.gradient.kcal}
      />
    </Container>
  );
}

const Container = styled.View`
  
`