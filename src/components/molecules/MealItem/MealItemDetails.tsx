import React from 'react';
import styled from 'styled-components/native';
import { ChartMacroCircles } from '../Chart';
import { MealProductItemMemo } from './MealProductItem';
import { MealId } from '../../../types';
import { ActivityIndicator } from 'react-native';
import { ButtonSecondary } from '../../atoms';
import { DiaryProduct } from '../../../store/reducers/diary';
import { Selectors } from '../../../store';
import { useIntl } from '../../../hooks';

export interface MealItemDetailsProps {
  meal: Selectors.MealCalced
  onProductQuantityUpdate: (mealId: MealId, product: DiaryProduct) => void
  onProductDelete: (mealId: MealId, product: DiaryProduct) => void
  onProductAdd: (meal: Selectors.MealCalced) => void
}

export const MealItemDetails = (props: MealItemDetailsProps) => {
  const t = useIntl();

  return (
    <>
      <ChartsContainer>
        <ChartMacroCircles
          values={props.meal.calcedMacro}
          percentages={props.meal.macroPercentages}
        />
      </ChartsContainer>
      <ProductsContainer>
        {props.meal.products.map(product => (
          <MealProductItemMemo
            key={product.data.id}
            mealId={props.meal.data.id as MealId}
            product={product}
            onQuantityUpdate={props.onProductQuantityUpdate}
            onDelete={props.onProductDelete}
          />
        ))}
        {props.meal.isAddingProduct && (
          <Spinner
            accessibilityLabel={t.addingProductPendingLabel}
            size={25}
          />
        )}
        <AddProductButton
          accessibilityLabel={t.addProductToMealLabel}
          accessibilityHint={t.addProductToMealHint}
          role="link"
          onPress={() => props.onProductAdd(props.meal)}
        >
          Dodaj produkt
        </AddProductButton>
      </ProductsContainer>
    </>
  );
}

const ChartsContainer = styled.View`
  padding: ${props => props.theme.spacing.smallHorizontal};
  border: ${props => `1px solid ${props.theme.color.quinary}`}; 
  background-color: ${props => props.theme.color.primary};
`

const ProductsContainer = styled.View`
  background-color: ${props => props.theme.color.primary};
  padding: ${props => props.theme.spacing.microXSmall};
  border-bottom-width: 1px;
  border-bottom-color: ${props => props.theme.color.tertiary};
`

const Spinner = styled(ActivityIndicator)`
  margin: ${props => props.theme.spacing.tinyVertical};
`

const AddProductButton = styled(ButtonSecondary)`
  margin: ${props => props.theme.spacing.smallVertical};
`