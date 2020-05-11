import React, { useState, useMemo } from 'react';
import styled from 'styled-components/native';
import {
  ChartMacroBars,
  Section,
  ChartMacroCircles,
  H1,
  TableMacro,
  RadioInputsRow,
  InputMetaText,
  ButtonPrimary,
  ButtonFavorite,
} from '../../components';
import {
  useNavigationData,
  useCalculatedMacro,
  useProductFavorite,
} from '../../hooks';
import { ProductPreviewScreenNavigationProps } from '../../navigation';
import { Product } from '../../database/entities';
import * as Utils from '../../utils';
import { ScrollView } from 'react-native';

export const ProductPreviewScreen = () => {
  const { params, navigation } = useNavigationData<ProductPreviewScreenNavigationProps>();
  const productPortionQuantity = 'portion' in params.product ? params.product.portion : Product.defaultPortion;
  const [quantity, setQuantity] = useState<number>(params.quantity ?? productPortionQuantity);
  const {
    macro,
    macroPercentages,
    macroNeeds,
  } = useCalculatedMacro(params.product.macro, quantity);
  const productFavorite = useProductFavorite(params.product.id);

  const isEditMode = params.onProductQuantityUpdated != null;

  const handleQuantityUpdate = (): void => {
    params.onProductQuantityUpdated?.(quantity);
  }

  const handlePortionUpdate = (portion: number): void => {
    setQuantity(productPortionQuantity * portion);
  }

  const dynamicPortionValue = useMemo(
    () => Math.round(quantity / productPortionQuantity),
    [quantity, productPortionQuantity]
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
    <Container>
      <ProductName>{params.product.name}</ProductName>
      {productFavorite.isFavorite !== null && (
        <ButtonFavorite
          isFavorite={productFavorite.isFavorite}
          onToggle={productFavorite.toggle}
        />
      )}
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
    </Container>
  );
}

const Container = styled(ScrollView)`
  padding: ${props => props.theme.spacing.small};
`

const SaveProductButton = styled(ButtonPrimary)`
  margin-right: ${props => props.theme.spacing.micro};
  min-width: 80px;
`

const ProductName = styled(H1)`
  margin-bottom: ${props => props.theme.spacing.tiny};
`

const Calories = styled(H1)`
  text-align: center;
  margin-bottom: ${props => props.theme.spacing.tiny};
`

const PORTIONS = Utils.fillArrayWithinRange({ from: 1, to: 6 });