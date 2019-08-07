import React from 'react';
import styled from 'styled-components/native';
import { TrashIcon } from '../Icons';
// @ts-ignore
import Swipeable from 'react-native-swipeable';
import { ProductId, MacroElements } from '../../types';
import { TouchableOpacity } from 'react-native';
import { Block } from '../Elements';
import { NutritionBox } from '../NutritionBox';
import { MACRO_ELEMENTS } from '../../common/consts';

interface ProductItemProps<P extends ProductPartial> {
  product: P
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
        rightContent={(
          <DeleteContainer>
            <TrashIcon
              width={20}
              height={20}
              fill="#fff"
            />
          </DeleteContainer>
        )}
      >
        <TouchableContent onPress={() => props.onToggle(productId)}>
          <Content>
            <Name>{props.product.name}</Name>
            <Quantity>{props.product.quantity}g</Quantity>
            <Calories>{props.product.kcal} kcal</Calories>
          </Content>
          {props.isToggled && (
            <Block space="space-evenly" marginVertical={8}>
              {MACRO_ELEMENTS.map(element => (
                <NutritionBox
                  key={element}
                  element={element}
                  value={props.product[element]}
                />
              ))}
            </Block>
          )}
        </TouchableContent>
      </Swipeable>
  );
}

const TouchableContent = styled(TouchableOpacity)`
  background: #F5F7F9;
  border-bottom-width: 1px;
  border-bottom-color: #E3E7EC;
`

const Content = styled.View`
  padding: 16px 25px;
  display: flex;
  flex-direction: row;
`

const Name = styled.Text`
  font-family: 'DMSans-Regular';
  font-size: 15px;
`

const Quantity = styled.Text`
  font-family: 'DMSans-Regular';
  font-size: 15px;
  color: #848484;
  margin-left: auto;
`

const Calories = styled.Text`
  font-family: 'DMSans-Regular';
  font-size: 15px;
  color: #848484;
  margin-left: 15px;
  min-width: 70px;
  text-align: right;
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