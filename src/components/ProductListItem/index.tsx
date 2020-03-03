import React from 'react';
import styled from 'styled-components/native';
import { NutritionBox } from '../NutritionBox';
import { TouchableOpacityProps } from 'react-native';

interface ProductListItemProps<T extends ProductLike>
  extends Omit<TouchableOpacityProps, 'onPress'>
{
  product: T
  onPress: (product: T) => void
}

const ProductListItem = <T extends ProductLike>(props: ProductListItemProps<T>) => {
  const {
    product,
    onPress,
    ...touchableProps
  } = props;

  return (
    <Container
    {...touchableProps}
      onPress={() => onPress(product)}
    >
      <Name>
        {product.name}
        {product.brand && ` (${product.brand})`}
      </Name>
      <Content>
        <Info>
          <Quantity>{product.portion}g</Quantity>
          <Kcal>{product.macro.kcal} kcal</Kcal>
        </Info>
        <NutritionContainer>
          <NutritionBox
            value={product.macro.carbs}
            element="carbs"
          />
          <NutritionBox
            value={product.macro.prots}
            element="prots"
          />
          <NutritionBox
            value={product.macro.fats}
            element="fats"
          />
        </NutritionContainer>
      </Content>
    </Container>
  );
}

const Container = styled.TouchableOpacity<{
  hideBottomLine?: boolean
}>`
  padding: 18px 0;
`

const Content = styled.View`
  flex-direction: row;
  justify-content: space-between;
`

const Name = styled.Text`
  font-family: ${props => props.theme.fontWeight.medium};
  font-size: ${props => props.theme.fontSize.regular};
  margin-bottom: 15px;
`

const Info = styled.View`
  flex-direction: row;
  align-items: center;
`

const Quantity = styled.Text`
  border-right-width: 1px;
  width: 55px;
  font-family: ${props => props.theme.fontWeight.regular};
  font-size: ${props => props.theme.fontSize.regular};
  color: ${props => props.theme.color.gray30};
  border-right-color: ${props => props.theme.color.gray10};
  margin-right: 16px;
`

const Kcal = styled.Text`
  width: 65px;
  font-family: ${props => props.theme.fontWeight.regular};
  font-size: ${props => props.theme.fontSize.regular};
  color: ${props => props.theme.color.gray30};
`

const NutritionContainer = styled.View`
  flex-direction: row;
  justify-content: space-around;
`

export const Separator = styled.View`
  height: 1px;
  width: 100%;
  background: ${props => props.theme.color.gray10};
`

export const ProductListItemMemo = React.memo(ProductListItem) as typeof ProductListItem;

interface ProductLike {
  name: string
  portion: number
  macro: {
    carbs: number
    prots: number
    fats: number
    kcal: number
  }
  brand?: string
}