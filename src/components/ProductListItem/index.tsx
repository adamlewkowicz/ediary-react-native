import React from 'react';
import { SteakIcon, WheatIcon, DropIcon } from '../Icons';
import styled from 'styled-components/native';
import { Theme } from '../../common/theme';
import { TextMeta } from '../Elements';
import { TouchableOpacity, TouchableOpacityProps } from 'react-native';

interface ProductListItemProps extends TouchableOpacityProps {
  hideBottomLine?: boolean
  product: {
    name: string
    portion?: number
    carbs: number
    prots: number
    fats: number
    kcal: number
  }
}
export const ProductListItem = ({
  product,
  hideBottomLine = false,
  ...props
}: ProductListItemProps) => {
  return (
    <TouchableOpacity {...props}>
      <Container hideBottomLine={hideBottomLine}>
        <InfoContainer>
          <Title>{product.name}</Title>
          <Info>
            <Quantity>{product.portion || 100}g</Quantity>
            <Kcal>{product.kcal} kcal</Kcal>
          </Info>
        </InfoContainer>
        <NutriContainer>
          <NutriInfo>
            <WheatIcon
              width={22}
              height={22}
              fill="#8AE4A5"
            />
            <TextMeta
              value={product.carbs}
              meta="g"
              valueFontSize={16}
              metaFontSize={13}
              marginTop="9px"
            />
          </NutriInfo>
          <NutriInfo>
            <SteakIcon
              width={22}
              height={22}
              fill="#7BD4E5"
            />
            <TextMeta
              value={product.prots}
              meta="g"
              valueFontSize={16}
              metaFontSize={13}
              marginTop="9px"
            />
          </NutriInfo>
          <NutriInfo>
            <DropIcon
              width={22}
              height={22}
              fill="#E8CF92"
            />
            <TextMeta
              value={product.fats}
              meta="g"
              valueFontSize={16}
              metaFontSize={13}
              marginTop="9px"
            />
          </NutriInfo>
        </NutriContainer>
      </Container>
    </TouchableOpacity>
  );
}

const Container = styled.View<{
  theme: Theme
  hideBottomLine?: boolean
}>`
  flex-direction: row;
  justify-content: space-between;
  border-bottom-width: 1px;
  border-bottom-color: ${props => props.hideBottomLine ? 'transparent' : '#E1E1E1'};
  padding: 25px 0;
`

const InfoContainer = styled.View`

`

const Title = styled.Text<{
  theme: Theme
}>`
  font-family: DMSans-Medium;
  font-size: 16px;
  margin-bottom: 9px;
`

const Info = styled.View`
  flex-direction: row;
`

const Quantity = styled.Text<{
  theme: Theme
}>`
  min-width: 45px;
  border-right-width: 1px;
  font-size: ${props => props.theme.fontSize};
  color: ${props => props.theme.secondaryColor};
  border-right-color: ${props => props.theme.secondaryColor};
`

const Kcal = styled.Text<{
  theme: Theme
}>`
  padding-left: 20px;
  font-size: ${props => props.theme.fontSize};
  color: ${props => props.theme.secondaryColor};
`

const NutriContainer = styled.View`
  flex-direction: row;
  justify-content: space-around;
`

const NutriInfo = styled.View`
  align-items: center;
  width: 65px;
`