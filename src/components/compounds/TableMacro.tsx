import React from 'react';
import styled from 'styled-components/native';
import { TextSecondary, TextPrimary, Table } from '../molecules/index';
import { MacroElements } from '../../types';

interface TableMacro<T extends MacroElements> {
  macro: T
}

export const TableMacro = <T extends MacroElements>(
  props: TableMacro<T>
) => {
  return (
    <Container>
      <Table.HeadRow>
        <Table.TH>Nazwa</Table.TH>
        <Table.TH>Ilość</Table.TH>
      </Table.HeadRow>
      <Table.Row>
        <TextSecondary>Węglowodany</TextSecondary>
        <TextPrimary>{props.macro.carbs.toFixed(1)} g</TextPrimary>
      </Table.Row>
      <Table.Row>
        <TextSecondary>Białko</TextSecondary>
        <TextPrimary>{props.macro.prots.toFixed(1)} g</TextPrimary>
      </Table.Row>
      <Table.Row>
        <TextSecondary>Tłuszcze</TextSecondary>
        <TextPrimary>{props.macro.fats.toFixed(1)} g</TextPrimary>
      </Table.Row>
      <Table.Row>
        <TextSecondary>Kalorie</TextSecondary>
        <TextPrimary>{props.macro.kcal.toFixed(1)} kcal</TextPrimary>
      </Table.Row>
    </Container>
  );
}

const Container = styled.View`
  margin: ${props => `${props.theme.spacing.sectionSecondary}px 0`};
`