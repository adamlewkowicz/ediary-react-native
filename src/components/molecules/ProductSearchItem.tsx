import React from 'react';
import styled from 'styled-components/native';
import { H2, TextSecondary, MacroDetails } from '../';
import { theme } from '../../common/theme';
import { ProductOrNormalizedProduct } from '../../database/entities';

interface ProductSearchItemProps<T = ProductOrNormalizedProduct> {
  product: T
  onSelect: (product: T) => void
}

export const ProductSearchItem = (props: ProductSearchItemProps) => {
  return (
    <Container
      onPress={() => props.onSelect(props.product)}
      accessibilityLabel="Dodaj produkt do posiłku"
      accessibilityHint="Wraca na główną stronę i dodaje produkt do posiłku"
    >
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
            value={props.product.macro.prots}
          />
          <MacroDetails
            title="T"
            color={theme.color.fats}
            value={props.product.macro.fats}
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
  padding: ${props => props.theme.spacingPX.baseXSmall};
`

const Info = styled.View`
  align-items: flex-end;
`

const MacroContainer = styled.View`
  flex-direction: row;
  margin-bottom: ${props => props.theme.spacingPX.micro};
`

const ProductName = styled(H2)`
  font-size: 14px;
`

export const ProductSearchItemMemo = React.memo(ProductSearchItem);