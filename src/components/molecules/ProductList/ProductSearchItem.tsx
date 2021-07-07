import React from 'react';
import styled from 'styled-components/native';
import { H2, TextSecondary, MacroDetails } from '../..';
import { THEME } from '../../../common/theme';
import { ProductOrNormalizedProduct } from '../../../database/entities';
import { useIntl } from '../../../hooks';

interface ProductSearchItemProps<T = ProductOrNormalizedProduct> {
  product: T
  onSelect: (product: T) => void
}

export const ProductSearchItem = (props: ProductSearchItemProps) => {
  const t = useIntl();

  return (
    <Container
      onPress={() => props.onSelect(props.product)}
      accessibilityLabel={t.addProductToMealLabel}
    >
      <ProductName>{props.product.name}</ProductName>
      <Content>
        <MacroContainer>
          <MacroDetails
            title={t.carbs[0]}
            color={THEME.color.carbs}
            value={props.product.macro.carbs}
          />
          <MacroDetails
            title={t.prots[0]}
            color={THEME.color.prots}
            value={props.product.macro.prots}
          />
          <MacroDetails
            title={t.fats[0]}
            color={THEME.color.fats}
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
  font-size: ${props => props.theme.fontSize.h4};
`

const Container = styled.TouchableOpacity`
  padding: ${props => props.theme.spacing.baseXSmall};
`

const Info = styled.View`
  align-items: flex-end;
`

const MacroContainer = styled.View`
  flex-direction: row;
  margin-bottom: ${props => props.theme.spacing.micro};
`

const ProductName = styled(H2)`
  font-size: 14px;
`

export const ProductSearchItemMemo = React.memo(ProductSearchItem);