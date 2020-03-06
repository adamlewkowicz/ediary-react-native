import React from 'react';
import styled from 'styled-components/native';
import { H4, TextHighlight, TextPrimary } from '../elements/Text';
import * as Table from '../elements/Table';

export const MealProductItem = () => {
  return (
    <Table.Row>
      <Details>
        <TextPrimary>Kurczak pieczony</TextPrimary>
        <H4>100g - 1 porcja</H4>
      </Details>
      <TextHighlight>128 kcal</TextHighlight>
    </Table.Row>
  );
}

const Details = styled.View`

`