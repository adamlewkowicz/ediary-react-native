import React, { useState, useMemo } from 'react';
import styled from 'styled-components/native';
import {
  ChartMacroBars,
  Section,
  ChartMacroCircles,
  H1,
  ScreenContainer,
  TableMacro,
  RadioInputsRow,
  InputMetaText,
  ButtonPrimary,
} from '../../_components';
import { useNavigationData, useCalculatedMacro } from '../../hooks';
import { ProductPreviewScreenNavigationProps } from '../../navigation';
import { fillArrayWithinRange } from '../../common/utils';

export const ProductPreviewScreen = () => {
  const { params, navigation } = useNavigationData<ProductPreviewScreenNavigationProps>();
  const [{ value: productPortion = 100 } = {}] = params.product.portions ?? [];
  const [quantity, setQuantity] = useState<number>(params.product.quantity ?? 0);
  const {
    macro: productMacro,
    macroPercentages: productMacroPercentages,
    macroNeeds: productMacroNeeds,
  } = useCalculatedMacro(params.product.macro, quantity);

  const isEditMode = params.onProductQuantityUpdated != null;

  const handleQuantityUpdate = (): void => {
    params.onProductQuantityUpdated?.(quantity);
  }

  const handlePortionUpdate = (portion: number): void => {
    setQuantity(productPortion * portion);
  }

  const dynamicPortionValue = useMemo(
    () => Math.round(quantity / productPortion),
    [quantity, productPortion]
  );

  if (isEditMode) {
    navigation.setOptions({
      headerTitle: 'Edytuj ilość produktu',
      headerRight: () => (
        <ButtonPrimary onPress={handleQuantityUpdate}>
          Zapisz
        </ButtonPrimary>
      )
    });
  } else {
    navigation.setOptions({
      headerTitle: params.product.name,
    });
  }

  return (
    <ScreenContainer>
      <ProductName>{params.product.name}</ProductName>
      <Section title="Ilość produktu">
        <RadioInputsRow
          title="Porcje"
          values={PORTIONS}
          activeValue={dynamicPortionValue}
          onChange={handlePortionUpdate}
        />
        <InputMetaText
          metaText="g"
          label="Ilość"
          placeholder="0"
          value={quantity.toString()}
          onChangeText={quantity => setQuantity(Number(quantity))}
          keyboardType="numeric"
        />
      </Section>
      <Section title="Makroskładniki">
        <Calories>
          {productMacro.kcal.toFixed(0)} kcal
        </Calories>
        <ChartMacroCircles
          values={[
            productMacro.carbs,
            productMacro.prots,
            productMacro.fats
          ]}
          percentages={[
            productMacroPercentages.carbs,
            productMacroPercentages.prots,
            productMacroPercentages.fats
          ]}
        />
        <TableMacro
          macro={productMacro}
        />
      </Section>
      <Section title="Dzienne cele">
        <ChartMacroBars
          percentages={[
            productMacroNeeds.carbs.percentage,
            productMacroNeeds.prots.percentage,
            productMacroNeeds.fats.percentage,
            productMacroNeeds.kcal.percentage
          ]}
        />
      </Section>
    </ScreenContainer>
  );
}

const ProductName = styled(H1)`
  margin-bottom: 20px;
`

const Calories = styled(H1)`
  text-align: center;
  margin-bottom: 10px;
`

const PORTIONS = fillArrayWithinRange({ from: 1, to: 6 });