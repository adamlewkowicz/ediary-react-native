import React from 'react';
import { Table, H4, TextHighlight, TextPrimary } from '..';
import { View, TouchableOpacity } from 'react-native';

interface MealProductItemProps {
  onPress?: () => void
}

export const MealProductItem = (props: MealProductItemProps) => {
  return (
    <TouchableOpacity onPress={props.onPress}>
      <Table.Row>
        <Details>
          <TextPrimary>Kurczak pieczony</TextPrimary>
          <H4>100g - 1 porcja</H4>
        </Details>
        <TextHighlight>128 kcal</TextHighlight>
      </Table.Row>
    </TouchableOpacity>
  );
}

const Details = View;