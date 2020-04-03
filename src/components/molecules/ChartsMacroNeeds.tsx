import React from 'react';
import styled from 'styled-components/native';
import { Selectors } from '../../store';
import { ChartCalories } from './ChartCalories';
import { ChartMacroCircleLeft } from '../';
import { theme } from '../../common/theme';

interface ChartsMacroNeedsProps {
  macroNeeds: Selectors.MacroNeeds
}

export const ChartsMacroNeeds = (props: ChartsMacroNeedsProps) => {
  const { carbs, prots, fats, kcal } = props.macroNeeds;

  return (  
    <>
      <ChartCalories
        percentages={kcal.percentage}
        value={kcal.eaten}
        valueLeft={kcal.needed}
      />
      <CirclesContainer>
        <ChartMacroCircleLeft
          title="Węglowodany (g)"
          value={carbs.eaten}
          valueLeft={carbs.needed}
          percentage={carbs.percentage}
          gradientColors={theme.gradient.carbs}
        />
        <ChartMacroCircleLeft
          title="Białko (g)"
          value={prots.eaten}
          valueLeft={prots.needed}
          percentage={prots.percentage}
          gradientColors={theme.gradient.prots}
        />
        <ChartMacroCircleLeft
          title="Tłuszcze (g)"
          value={fats.eaten}
          valueLeft={fats.needed}
          percentage={fats.percentage}
          gradientColors={theme.gradient.fats}
        />
      </CirclesContainer>

    </>
  );
}

const CirclesContainer = styled.View`
  flex-direction: row;
  justify-content: space-around;
  padding: ${props => props.theme.spacingPX.smallHorizontal};
  margin: ${props => props.theme.spacingPX.smallVertical};
`