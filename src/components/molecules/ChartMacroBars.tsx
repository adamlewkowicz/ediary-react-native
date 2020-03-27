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
        percentage={carbs}
        gradientColors={theme.gradient.carbs}
      />
      <ChartMacroBar
        title="Białko"
        percentage={prots}
        gradientColors={theme.gradient.prots}
      />
      <ChartMacroBar
        title="Tłuszcze"
        percentage={fats}
        gradientColors={theme.gradient.fats}
      />
      <ChartMacroBar
        title="Kalorie"
        percentage={kcal}
        gradientColors={theme.gradient.kcal}
      />
    </Container>
  );
}

const Container = styled.View`
  
`