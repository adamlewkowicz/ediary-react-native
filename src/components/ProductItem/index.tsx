import React from 'react';
import styled, { css } from 'styled-components/native';
import { TrashIcon } from '../Icons';
// @ts-ignore
import Swipeable from 'react-native-swipeable';
import { ProductId, MacroElements } from '../../types';
import { TouchableOpacity } from 'react-native';
import { Block } from '../Elements';
import { NutritionBox } from '../NutritionBox';
import { MACRO_ELEMENTS } from '../../common/consts';
import { InputRow } from '../InputRow';
import { Theme } from '../../common/theme';

interface ProductItemProps<P extends ProductPartial> {
  product: P
  onQuantityUpdate: (productId: ProductId, quantity: number) => void
  onDelete: (productId: ProductId) => void
  onToggle: (productId: ProductId) => void
  isToggled: boolean
}
export function ProductItem<P extends ProductPartial>(props: ProductItemProps<P>) {
  const productId = props.product.id;

  return (
      <Swipeable
        onRightActionRelease={() => props.onDelete(productId)}
        rightActionActivationDistance={200}
        rightButtonWidth={200}
        rightContent={props.isToggled ? null : (
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
          onPress={() => props.onToggle(productId)}
          accessibilityLabel="Pokaż szczegóły produktu"
        >
          <Block align="stretch" space="space-between">
            <Name numberOfLines={props.isToggled ? undefined : 1}>
              {props.product.name}
            </Name>
            <Quantity accessibilityLabel="Ilość produktu">
              {props.product.quantity}g
            </Quantity>
            <Calories>{props.product.kcal} kcal</Calories>
          </Block>
          {props.isToggled && (
            <>
              <InputRow
                title="Zmień ilość"
                accessibilityLabel="Zmień ilość produktu"
                value={props.product.quantity.toString()}
                onChangeText={quantity => props.onQuantityUpdate(productId, Number(quantity))}
                css={InputRowStyle}
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
  padding: 16px 25px;
`

const InputRowStyle = css`
  margin: 20px 0 15px 0;
`

const Name = styled.Text`
  font-family: 'DMSans-Regular';
  font-size: 15px;
  flex: 1;
  margin-right: 14px;
`

const Quantity = styled.Text`
  font-family: 'DMSans-Regular';
  font-size: 15px;
  color: #848484;
  margin-left: auto;
  margin-right: 14px;
`

const Calories = styled.Text<{
  theme: Theme
}>`
  font-family: 'DMSans-Regular';
  font-size: 15px;
  color: #848484;
  text-align: right;
  color: ${props => props.theme.colors.lightBlue};
`

const DeleteContainer = styled.View`
  background-color: #e74c3c;
  flex: 1;
  justify-content: center;
  align-items: center;
  padding-left: 10px;
`

export interface ProductPartial extends MacroElements {
  id: number
  name: string
  quantity: number
}