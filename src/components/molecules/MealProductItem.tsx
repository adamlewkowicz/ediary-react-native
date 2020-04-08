import React from 'react';
import { Table, H4, TextHighlight, TextPrimary } from '..';
import { TouchableOpacity } from 'react-native';
import styled from 'styled-components/native';
import { MealId } from '../../types';
import { DiaryProduct } from '../../store/reducers/diary';

interface MealProductItemProps<T> {
  mealId: MealId
  product: T
  onQuantityUpdate: (mealId: MealId, product: T) => void
  onDelete: (mealId: MealId, product: T) => void
}

export const MealProductItem = <T extends DiaryProduct>(props: MealProductItemProps<T>) => {
  const { product, mealId } = props;

  return (
    <TouchableOpacity
      accessibilityLabel="Pokaż szczegóły lub usuń produkt"
      accessibilityHint="Dotknij aby wyświetlić szczegóły produktu, lub przytrzymaj aby go usunąć"
      accessibilityRole="link"
      onPress={() => props.onQuantityUpdate(mealId, product)}
      onLongPress={() => props.onDelete(mealId, product)}
    >
      <Table.Row>
        <Details>
          <ProductName>{product.data.name}</ProductName>
          <Quantity accessibilityLabel="Ilość produktu">
            {product.quantity}g
          </Quantity>
        </Details>
        <Calories>{product.calcedMacro.kcal.toFixed(0)} kcal</Calories>
      </Table.Row>
    </TouchableOpacity>
  );
}

const ProductName = styled(TextPrimary)`
  color: ${props => props.theme.color.primaryLight};
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

export const MealProductItemMemo = React.memo(MealProductItem);