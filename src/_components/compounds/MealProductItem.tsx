import React from 'react';
import { Table, H4, TextHighlight, TextPrimary } from '..';
import { View, TouchableOpacity } from 'react-native';
import styled from 'styled-components/native';

interface MealProductItemProps {
  onPress?: () => void
  product: {
    name: string
    quantity: number
    macro: { kcal: number }
  }
}

export const MealProductItem = (props: MealProductItemProps) => {
  return (
    <TouchableOpacity onPress={props.onPress}>
      <Table.Row>
        <Details>
          <ProductName>{props.product.name}</ProductName>
          <Quantity>{props.product.quantity}g - 1 porcja</Quantity>
        </Details>
        <Calories>{props.product.macro.kcal} kcal</Calories>
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