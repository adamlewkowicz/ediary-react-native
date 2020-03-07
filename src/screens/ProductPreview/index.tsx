import React from 'react';
import { ScreenContainer } from '../../elements/ScreenContainer';
import { Section } from '../../elements/Section';
import { H1 } from '../../elements/Text';
import { MacroCharts } from '../../components';
import styled from 'styled-components/native';
import { RadioInputsRow } from '../../components';
import { ProductMacroTable } from '../../elements/ProductMacroTable';
import { ChartMacroBars } from '../../components';
import { InputMetaText } from '../../components';

export const ProductPreviewScreen = () => {
  return (
    <ScreenContainer>
      <H1>Pomidory w puszce</H1>
      <Section title="Ilość produktu">
        <RadioInputsRow
          title="Porcje"
          values={[1, 2, 3]}
          activeValue={1}
          onChange={() => {}}
        />
        <RadioInputsRow
          title="Szklanki"
          values={[1, 2, 3, 4]}
          activeValue={2}
          onChange={() => {}}
        />
        <InputMetaText
          metaText="g"
          label="Ilość"
          placeholder="0"
          value={"417"}
        />
      </Section>
      <Section title="Makroskładniki">
        <Kcal>421 kcal</Kcal>
        <MacroCharts
          values={[45, 18, 23]}
          percentages={[45, 67, 12]}
        />
        <ProductMacroTable
          macro={{
            'Tłuszcze': 41,
            'w tym nasycone kwasy tłuszczowe': 41,
            'Węglowodany': 41,
            'w tym cukry': 41,
            'Białko': 41,
            'Witamina A': 41,
          }}
        />
      </Section>
      <Section title="Dzienne cele">
        <ChartMacroBars
          percentages={[41, 84, 16, 48]}
        />
      </Section>
    </ScreenContainer>
  );
}

const Kcal = styled(H1)`
  text-align: center;
  margin-bottom: 10px;
`