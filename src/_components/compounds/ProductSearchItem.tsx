import React from 'react';
import styled from 'styled-components/native';
import { H2, TextSecondary } from '../atoms/Text';
import { MacroDetails } from '../molecules/_index';
import { theme } from '../../common/theme';
import { ProductOrNormalizedProduct } from '../../database/entities';

interface ProductSearchItemProps {
  product: ProductOrNormalizedProduct
}

export const ProductSearchItem = (props: ProductSearchItemProps) => {
  return (
    <Container>
      <ProductName>{props.product.name}</ProductName>
      <Content>
        <MacroContainer>
          <MacroDetails
            title="W"
            color={theme.color.carbs}
            value={props.product.macro.carbs}
          />
          <MacroDetails
            title="B"
            color={theme.color.prots}
            value={25.51}
          />
          <MacroDetails
            title="T"
            color={theme.color.fats}
            value={113.51}
          />
        </MacroContainer>
        <Info>
          <TextSecondary>
            {props.product.portion}g
          </TextSecondary>
          <Calories>
            {props.product.macro.kcal} kcal
          </Calories>
        </Info>
      </Content>
    </Container>
  );
}

const Content = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-end;
`

const Calories = styled(H2)`
  font-size: ${props => props.theme.fontSize.large};
`

const Container = styled.TouchableOpacity`
  padding: ${props => props.theme.spacing.screenPadding};
`

const Info = styled.View`
  align-items: flex-end;
`

const MacroContainer = styled.View`
  flex-direction: row;
  margin-bottom: 4px;
`

const ProductName = styled(H2)`
  font-size: 14px;
`