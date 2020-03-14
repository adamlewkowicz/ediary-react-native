import React from 'react';
import { Table, H4, TextHighlight, TextPrimary } from '..';
import { View, TouchableOpacity } from 'react-native';
import styled from 'styled-components/native';

interface MealProductItemProps {
  onPress?: () => void
}

export const MealProductItem = (props: MealProductItemProps) => {
  return (
    <TouchableOpacity onPress={props.onPress}>
      <Table.Row>
        <Details>
          <ProductName>Kurczak pieczony</ProductName>
          <Quantity>100g - 1 porcja</Quantity>
        </Details>
        <Calories>128 kcal</Calories>
      </Table.Row>
    </TouchableOpacity>
  );
}

const ProductName = styled(TextPrimary)`
  color: #fff;
`

const Quantity = styled(H4)`
  color: ${props => props.theme.color.quaternary};
`

const Calories = styled(TextHighlight)`
  color: ${props => props.theme.color.highlightSecondary};
`

const Details = View;