import React from 'react';
import styled from 'styled-components/native';

interface ProductItemProps {
  product: ProductPartial
}
export const ProductItem = (props: ProductItemProps) => {
  return (
    <Container>
      <Name>{props.product.name}</Name>
      <Quantity>{props.product.quantity}g</Quantity>
      <Calories>{props.product.kcal} kcal</Calories>
    </Container>
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
  /* background: red; */
  min-width: 70px;
  text-align: right;
`

export interface ProductPartial {
  id: number
  name: string
  quantity: number
  kcal: number
}