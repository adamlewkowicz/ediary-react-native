import React from 'react';
import styled from 'styled-components/native';
import { TextPrimary, H2, TextSecondary } from '../atoms/Text';
import { MacroDetails } from '../molecules/_index';
import { theme } from '../../common/theme';

interface ProductSearchItemProps {

}

export const ProductSearchItem = (props: ProductSearchItemProps) => {
  return (
    <Container>
      <Info>
        <ProductName>Sos pomidorowy na maśle</ProductName>
      </Info>
      <TextSecondary>
          245g
        </TextSecondary>
      <MacroContainer>
        <MacroDetails
          percentages={45}
          colors={theme.gradient.carbs}
          color={theme.color.carbs}
          title="Węgle"
          value={41}
        />
        <MacroDetails
          percentages={45}
          colors={theme.gradient.prots}
          color={theme.color.prots}
          title="Białko"
          value={25.51}
        />
        <MacroDetails
          percentages={45}
          colors={theme.gradient.fats}
          color={theme.color.fats}
          title="Tłuszcze"
          value={113.51}
        />
      </MacroContainer>

    </Container>
  );
}

const Container = styled.View`

`

const Info = styled.View`
`

const MacroContainer = styled.View`
  /* margin-top: 10px; */
  flex-direction: row;
  justify-content: space-between;
`

const ProductName = styled(H2)`

`

// const Macro