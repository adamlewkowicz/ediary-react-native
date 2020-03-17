import React from 'react';
import { Table, H4, TextHighlight, TextPrimary } from '..';
import { TouchableOpacity } from 'react-native';
import styled from 'styled-components/native';

interface MealProductItemProps {
  onPress?: () => void
  onDelete?: () => void
  name: string
  quantity: number
  kcal: number
}

export const MealProductItem = (props: MealProductItemProps) => {
  return (
    <TouchableOpacity onPress={props.onPress} onLongPress={props.onDelete}>
      <Table.Row>
        <Details>
          <ProductName>{props.name}</ProductName>
          <Quantity>{props.quantity}g - 1 porcja</Quantity>
        </Details>
        <Calories>{props.kcal.toFixed(0)} kcal</Calories>
      </Table.Row>
    </TouchableOpacity>
  );
}

const ProductName = styled(TextPrimary)`
  color: #fff;
  margin-bottom: 1px;
`

const Quantity = styled(H4)`
  color: ${props => props.theme.color.quaternary};
`

const Calories = styled(TextHighlight)`
  color: ${props => props.theme.color.highlightSecondary};
`

const Details = styled.View`
  flex: 1;
`