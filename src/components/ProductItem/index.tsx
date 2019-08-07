import React from 'react';
import styled from 'styled-components/native';
import { TrashIcon } from '../Icons';
// @ts-ignore
import Swipeable from 'react-native-swipeable';

interface ProductItemProps {
  product: ProductPartial
  onProductDelete: () => void
}
export const ProductItem = (props: ProductItemProps) => {
  return (
    <Swipeable
      onRightActionRelease={props.onProductDelete}
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
      <Container>
        <Name>{props.product.name}</Name>
        <Quantity>{props.product.quantity}g</Quantity>
        <Calories>{props.product.kcal} kcal</Calories>
      </Container>
    </Swipeable>
  );
}

const Container = styled.View`
  background: #F5F7F9;
  padding: 16px 25px;
  display: flex;
  flex-direction: row;
  border-bottom-width: 1px;
  border-bottom-color: #E3E7EC;
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

export interface ProductPartial {
  id: number
  name: string
  quantity: number
  kcal: number
}