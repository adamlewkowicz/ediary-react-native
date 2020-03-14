import React, { useState } from 'react';
import styled from 'styled-components/native';
import {
  ChartMacroBars,
  Section,
  ChartMacroCircles,
  H1,
  ScreenContainer,
  ProductMacroTable,
  RadioInputsRow,
  InputMetaText,
  ButtonPrimary,
} from '../../_components';
import { useNavigationData } from '../../hooks';
import { ProductPreviewScreenNavigationProps } from '../../navigation';

export const ProductPreviewScreen = () => {
  const { params, navigation } = useNavigationData<ProductPreviewScreenNavigationProps>();
  const [{ value: productPortion = 100 } = {}] = params.product.portions ?? [];
  const [quantity, setQuantity] = useState<number>(params.product.quantity ?? 0);

  const isEditMode = params.onProductQuantityUpdated != null;

  const handleQuantityUpdate = (): void => {
    params.onProductQuantityUpdated?.(quantity);
  }

  const handlePortionUpdate = (portion: number): void => {
    setQuantity(productPortion * portion);
  }

  const dynamicPortion = Math.round(quantity / productPortion);

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
      <H1>{params.product.name}</H1>
      <Section title="Ilość produktu">
        <RadioInputsRow
          title="Porcje"
          values={[1, 2, 3, 4, 5]}
          activeValue={dynamicPortion}
          onChange={handlePortionUpdate}
        />
        <InputMetaText
          metaText="g"
          label="Ilość"
          placeholder="0"
          value={quantity.toString()}
          onChangeText={quantity => setQuantity(Number(quantity))}
        />
      </Section>
      <Section title="Makroskładniki">
        <Kcal>{params.product.macro.kcal} kcal</Kcal>
        <ChartMacroCircles
          values={[
            params.product.macro.carbs,
            params.product.macro.prots,
            params.product.macro.fats,
          ]}
          percentages={[45, 67, 12]}
        />
        <ProductMacroTable
          macro={{
            'Tłuszcze': 41,
            'w tym nasycone kwasy tłuszczowe': 41,
            'Węglowodany': 41,
            'w tym cukry': 41,
            'Białko': 41,
            'Witamina A': 41,
          }}
        />
      </Section>
      <Section title="Dzienne cele">
        <ChartMacroBars
          percentages={[41, 84, 16, 48]}
        />
      </Section>
    </ScreenContainer>
  );
}

const Kcal = styled(H1)`
  text-align: center;
  margin-bottom: 10px;
`