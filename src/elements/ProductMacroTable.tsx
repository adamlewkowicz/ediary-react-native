import React from 'react';
import * as Table from './Table';
import styled from 'styled-components/native';
import { TextSecondary, TextPrimary } from './Text';

interface ProductMacroTableProps {
  macro: { [key: string]: number }
}

export const ProductMacroTable = React.memo((props: ProductMacroTableProps) => {
  return (
    <Container>
      <Table.HeadRow>
        <Table.TH>Nazwa</Table.TH>
        <Table.TH>Ilość</Table.TH>
      </Table.HeadRow>
      {Object.entries(props.macro).map(([property, value]) => (
        <Table.Row key={property}>
          <TextSecondary>{property}</TextSecondary>
          <TextPrimary>{value}g</TextPrimary>
        </Table.Row>
      ))}
    </Container>
  );
});

const Container = styled.View`
  margin: ${props => `${props.theme.spacing.sectionSecondary}px 0`};
`