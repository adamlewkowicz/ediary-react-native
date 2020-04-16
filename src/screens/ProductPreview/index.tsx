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
  useProductFavorites,
  useIsFavoriteProduct,
} from '../../hooks';
import { ProductPreviewScreenNavigationProps } from '../../navigation';
import { Product } from '../../database/entities';
import * as Utils from '../../utils';
import { ScrollView } from 'react-native';

export const ProductPreviewScreen = () => {
  const { params, navigation } = useNavigationData<ProductPreviewScreenNavigationProps>();
  const [{ value: productPortion = Product.defaultPortion } = {}] = params.product.portions ?? [];
  const [quantity, setQuantity] = useState<number>(params.quantity ?? 0);
  const {
    macro,
    macroPercentages,
    macroNeeds,
  } = useCalculatedMacro(params.product.macro, quantity);
  const productFavorites = useProductFavorites();
  const isFavorite = useIsFavoriteProduct(params.product.id);

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
    <Container>
      <ProductName>{params.product.name}</ProductName>
      {isFavorite !== null && (
        <ButtonFavorite
          isFavorite={isFavorite}
          onFavoriteToggle={() => productFavorites.toggle(params.product)}
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
  margin-bottom: ${props => props.theme.spacing.base};
`

const Calories = styled(H1)`
  text-align: center;
  margin-bottom: ${props => props.theme.spacing.tiny};
`

const PORTIONS = Utils.fillArrayWithinRange({ from: 1, to: 6 });