import React from 'react';
import { ScreenContainer } from '../../elements/ScreenContainer';
import { Section } from '../../elements/Section';
import { H1 } from '../../elements/Text';
import { MacroCharts } from '../../molecules/MacroCharts';
import styled from 'styled-components/native';

export const ProductPreviewScreen = () => {
  return (
    <ScreenContainer>
      <H1>Pomidory w puszce</H1>
      <Section title="Ilość produktu">

      </Section>
      <Section title="Makroskładniki">
        <Kcal>421 kcal</Kcal>
        <MacroCharts
          values={[45, 18, 23]}
          percentages={[45, 67, 12]}
        />
      </Section>
      <Section title="Dzienne cele">
        
      </Section>
    </ScreenContainer>
  );
}

const Kcal = styled(H1)`
  text-align: center;
  margin-bottom: 10px;
`