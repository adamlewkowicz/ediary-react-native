import React from 'react';
import styled, { css } from 'styled-components/native';
import { TrashIcon } from '../Icons';
// @ts-ignore
import Swipeable from 'react-native-swipeable';
import { MacroElements } from '../../types';
import { TouchableOpacity } from 'react-native';
import { Block } from '../Elements';
import { NutritionBox } from '../NutritionBox';
import { MACRO_ELEMENTS } from '../../common/consts';
import { InputRow } from '../InputRow';

interface ProductItemProps<P extends ProductPartial> {
  product: P
  onQuantityUpdate: (quantity: number) => void
  onDelete: () => void
  onToggle: () => void
}

export function ProductItem<P extends ProductPartial>(props: ProductItemProps<P>) {
  return (
    <Swipeable
      onRightActionRelease={() => props.onDelete()}
      rightActionActivationDistance={200}
      rightButtonWidth={200}
      rightContent={props.product.isToggled ? null : (
        <DeleteContainer>
          <TrashIcon
            width={20}
            height={20}
            fill="#fff"
          />
        </DeleteContainer>
      )}
    >
      <TouchableContent
        onPress={() => props.onToggle()}
        onLongPress={() => props.onDelete()}
        accessibilityLabel="Pokaż szczegóły lub usuń produkt"
        accessibilityHint="Pokaż szczegóły produktu, lub przytrzymaj dłużej aby go usunąć"
      >
        <Block align="flex-start" space="space-between">
          <Name numberOfLines={props.product.isToggled ? undefined : 1}>
            {props.product.name}
          </Name>
          <Quantity accessibilityLabel="Ilość produktu">
            {props.product.quantity}g
          </Quantity>
          <Calories accessibilityLabel="Kalorie w produkcie">
            {props.product.kcal} kcal
          </Calories>
        </Block>
        {props.product.isToggled && (
          <>
            <InputRow
              title="Zmień ilość"
              accessibilityLabel="Zmień ilość produktu"
              value={props.product.quantity.toString()}
              onChangeText={quantity => props.onQuantityUpdate(Number(quantity))}
              styles={InputRowStyle}
            />
            <Block space="space-evenly">
              {MACRO_ELEMENTS.map(element => (
                <NutritionBox
                  key={element}
                  element={element}
                  value={props.product[element]}
                  accessibilityLabel="Makroskładniki produktu"
                />
              ))}
            </Block>
          </>
        )}
      </TouchableContent>
    </Swipeable>
  );
}

const TouchableContent = styled(TouchableOpacity)`
  background: #F5F7F9;
  border-bottom-width: 1px;
  border-bottom-color: #E3E7EC;
  padding: 16px 20px;
`

const InputRowStyle = css`
  margin: 20px 0 15px 0;
`

const Name = styled.Text`
  font-family: ${props => props.theme.fontWeight.regular};
  font-size: ${props => props.theme.fontSize.regular};
  flex: 1;
  margin-right: 14px;
`

const Quantity = styled.Text`
  font-family: ${props => props.theme.fontWeight.regular};
  font-size: ${props => props.theme.fontSize.regular};
  color: #848484;
  margin-left: auto;
  margin-right: 10px;
`

const Calories = styled.Text`
  font-family: ${props => props.theme.fontWeight.regular};
  font-size: ${props => props.theme.fontSize.regular};
  color: #848484;
  text-align: right;
  color: ${props => props.theme.colors.lightBlue};
  min-width: 65px;
`

const DeleteContainer = styled.View`
  flex: 1;
  background-color: #e74c3c;
  justify-content: center;
  align-items: center;
  padding-left: 10px;
`

export interface ProductPartial extends MacroElements {
  id: number
  name: string
  quantity: number
  isToggled: boolean
}