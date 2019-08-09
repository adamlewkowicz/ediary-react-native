import React from 'react';
import styled from 'styled-components/native';
import { Theme } from '../../common/theme';
import { TouchableOpacity, TouchableOpacityProps } from 'react-native';
import { NutritionBox } from '../NutritionBox';
import { PhraseSelector } from '../PhraseSelector';

interface ProductListItemProps extends TouchableOpacityProps {
  hideBottomLine?: boolean
  product: {
    name: string
    portion?: number
    carbs: number
    prots: number
    fats: number
    kcal: number
    brand?: string
  }
  phrase?: string
}
export const ProductListItem = ({
  product,
  hideBottomLine = false,
  phrase,
  ...props
}: ProductListItemProps) => {
  return (
    <TouchableOpacity {...props}>
      <Container>
        <Name>
          {product.name}
          {product.brand && ` (${product.brand})`}
        </Name>
        <Content>
          <Info>
            <Quantity>{product.portion || 100}g</Quantity>
            <Kcal>{product.kcal} kcal</Kcal>
          </Info>
          <NutritionContainer>
            <NutritionBox
              value={product.carbs}
              element="carbs"
            />
            <NutritionBox
              value={product.prots}
              element="prots"
            />
            <NutritionBox
              value={product.fats}
              element="fats"
            />
          </NutritionContainer>
        </Content>
        </Container>
    </TouchableOpacity>
  );
}

const Container = styled.View<{
  theme: Theme
  hideBottomLine?: boolean
}>`
  border-bottom-width: 1px;
  border-bottom-color: ${props => props.hideBottomLine ? 'transparent' : '#E1E1E1'};
  padding: 18px 0;
`

const Content = styled.View`
  flex-direction: row;
  justify-content: space-between;
`

const Name = styled.Text`
  font-family: DMSans-Medium;
  font-size: 16px;
  margin-bottom: 9px;
`

const Info = styled.View`
  flex-direction: row;
  align-items: center;
`

const Quantity = styled.Text<{
  theme: Theme
}>`
  border-right-width: 1px;
  width: 55px;
  font-size: ${props => props.theme.fontSize};
  color: ${props => props.theme.secondaryColor};
  border-right-color: ${props => props.theme.secondaryColor};
  margin-right: 16px;
`

const Kcal = styled.Text<{
  theme: Theme
}>`
  width: 65px;
  font-size: ${props => props.theme.fontSize};
  color: ${props => props.theme.secondaryColor};
`

const NutritionContainer = styled.View`
  flex-direction: row;
  justify-content: space-around;
`