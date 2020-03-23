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
import { Product } from '../../database/entities';
import * as Utils from '../../utils';

export const ProductPreviewScreen = () => {
  const { params, navigation } = useNavigationData<ProductPreviewScreenNavigationProps>();
  const [{ value: productPortion = Product.defaultPortion } = {}] = params.product.portions ?? [];
  const [quantity, setQuantity] = useState<number>(params.quantity ?? 0);
  const {
    macro,
    macroPercentages,
    macroNeeds,
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
        <SaveProductButton onPress={handleQuantityUpdate}>
          Zapisz
        </SaveProductButton>
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
          {macro.kcal.toFixed(0)} kcal
        </Calories>
        <ChartMacroCircles
          values={macro}
          percentages={macroPercentages}
        />
        <TableMacro
          macro={macro}
        />
      </Section>
      <Section title="Dzienne cele">
        <ChartMacroBars
          percentages={[
            macroNeeds.carbs.percentage,
            macroNeeds.prots.percentage,
            macroNeeds.fats.percentage,
            macroNeeds.kcal.percentage
          ]}
        />
      </Section>
    </ScreenContainer>
  );
}

const SaveProductButton = styled(ButtonPrimary)`
  margin-right: 5px;
  min-width: 80px;
`

const ProductName = styled(H1)`
  margin-bottom: 20px;
`

const Calories = styled(H1)`
  text-align: center;
  margin-bottom: 10px;
`

const PORTIONS = Utils.fillArrayWithinRange({ from: 1, to: 6 });