import React, { useReducer, useRef } from 'react';
import styled from 'styled-components/native';
import {
  productCreateReducer,
  initProductCreateReducer,
  ProductDataPayload,
  normalizeProductData,
} from './reducer';
import { TextInput, ScrollView } from 'react-native';
import { useUserId, useNavigationData } from '../../hooks';
import { Product } from '../../database/entities';
import { ProductCreateScreenNavigationProps } from '../../navigation';
import {
  Section,
  Table,
  Group,
  TextSecondary,
  TextPrimary,
  ButtonPrimary,
  InputRef,
  InputButtonRef,
  InputMetaTextRef,
} from '../../_components';

interface ProductCreateScreenProps {}

export const ProductCreateScreen = (props: ProductCreateScreenProps) => {
  const { params, navigation, navigate } = useNavigationData<ProductCreateScreenNavigationProps>();
  const [state, dispatch] = useReducer(
    productCreateReducer,
    params,
    initProductCreateReducer
  );
  const userId = useUserId();
  
  const brandInputRef = useRef<TextInput>(null);
  const producerInputRef = useRef<TextInput>(null);
  const portionQuantityInputRef = useRef<TextInput>(null);
  const carbsInputRef = useRef<TextInput>(null);
  const sugarsInputRef = useRef<TextInput>(null);
  const protsInputRef = useRef<TextInput>(null);
  const fatsInputRef = useRef<TextInput>(null);
  const fattyAcidsInputRef = useRef<TextInput>(null);
  const kcalInputRef = useRef<TextInput>(null);
  const barcodeInputRef = useRef<TextInput>(null);

  async function handleProductCreate() {
    const normalizedProductData = normalizeProductData(state.productData);

    const createdProduct = await Product.save({
      ...normalizedProductData,
      userId,
    });

    params.onProductCreated?.(createdProduct);
  }

  const handleProductDataUpdate = (payload: ProductDataPayload): void => {
    dispatch({ type: 'PRODUCT_DATA_UPDATED', payload });
  }

  const handleCaloriesEvaluation = (): void => {
    dispatch({ type: 'CALORIES_EVALUATED' });
  }
  
  const handleBarcodeScanNavigation = (): void => {
    navigate('BarcodeScan', {
      onBarcodeDetected(barcode) {
        navigation.goBack();
        handleProductDataUpdate({ barcode });
      }
    });
  }

  return (
    <ScrollView>
      <Container>
        <Section title="Podstawowe dane">
          <InputRef 
            label="Nazwa"
            placeholder="Mleko UHT 3.2 %"
            value={state.productData.name}
            onChangeText={name => handleProductDataUpdate({ name })}
            onSubmitEditing={brandInputRef.current?.focus}
          />
          <InputRef
            ref={brandInputRef}
            label="Marka"
            placeholder="Łaciate"
            value={state.productData.brand}
            onChangeText={brand => handleProductDataUpdate({ brand })}
            onSubmitEditing={producerInputRef.current?.focus}
          />
          <InputRef 
            label="Producent"
            placeholder="Mlekovita"
            value={state.productData.producer}
            onChangeText={producer => handleProductDataUpdate({ producer })}
            ref={producerInputRef}
            onSubmitEditing={portionQuantityInputRef.current?.focus}
          />
          <InputMetaTextRef
            label="Ilość w jednej porcji"
            placeholder="100"
            value={state.productData.portionQuantity}
            onChangeText={portionQuantity => handleProductDataUpdate({ portionQuantity })}
            metaText={state.portionUnitType}
            keyboardType={KEYBOARD_NUMERIC}
            ref={portionQuantityInputRef}
            onSubmitEditing={carbsInputRef.current?.focus}
          />
        </Section>
        <Section
          title="Makroskładniki"
          description={`Na 100${state.portionUnitType} produtku`}
        >
          <Group.Container>
            <InputRef
              value={state.productData.carbs}
              onChangeText={carbs => handleProductDataUpdate({ carbs })}
              label="Węglowodany"
              placeholder="0"
              keyboardType={KEYBOARD_NUMERIC}
              ref={carbsInputRef}
              onSubmitEditing={sugarsInputRef.current?.focus}
            />
            <Group.Separator />
            <InputRef
              label="w tym cukry"
              placeholder="0"
              keyboardType={KEYBOARD_NUMERIC}
              ref={sugarsInputRef}
              onSubmitEditing={protsInputRef.current?.focus}
            />
          </Group.Container>
          <InputMetaTextRef
            value={state.productData.prots}
            onChangeText={prots => handleProductDataUpdate({ prots })}
            label="Białko"
            placeholder="0"
            metaText="g"
            keyboardType={KEYBOARD_NUMERIC}
            ref={protsInputRef}
            onSubmitEditing={fatsInputRef.current?.focus}
          />
          <Group.Container>
            <InputRef
              value={state.productData.fats}
              onChangeText={fats => handleProductDataUpdate({ fats })}
              label="Tłuszcze"
              placeholder="0"
              keyboardType={KEYBOARD_NUMERIC}
              ref={fatsInputRef}
              onSubmitEditing={fattyAcidsInputRef.current?.focus}
            />
            <Group.Separator />
            <InputRef
              label="w tym kwasy tłuszczowe"
              placeholder="0"
              keyboardType={KEYBOARD_NUMERIC}
              ref={fattyAcidsInputRef}
              onSubmitEditing={kcalInputRef.current?.focus}
            />
          </Group.Container>
          <InputButtonRef
            value={state.productData.kcal}
            onChangeText={kcal => handleProductDataUpdate({ kcal })}
            label="Kalorie"
            placeholder="0"
            buttonText="Oblicz"
            keyboardType={KEYBOARD_NUMERIC}
            onButtonPress={handleCaloriesEvaluation}
            ref={kcalInputRef}
            onSubmitEditing={barcodeInputRef.current?.focus}
          />
        </Section>
        <Section title="Porcje">
          <Table.HeadRow>
            <Table.TH>Nazwa</Table.TH>
            <Table.TH>Ilość</Table.TH>
          </Table.HeadRow>
          {PRODUCTS.map(productName => (
            <Table.Row key={productName}>
              <TextSecondary>{productName}</TextSecondary>
              <TextPrimary>150g</TextPrimary>
            </Table.Row>
          ))}
        </Section>
        <Section title="Inne">
          <InputButtonRef
            label="Kod kreskowy"
            placeholder="5900512300108"
            buttonText="Zeskanuj"
            onButtonPress={handleBarcodeScanNavigation}
            ref={barcodeInputRef}
          />
        </Section>
        <ButtonPrimary onPress={handleProductCreate}>
          Zapisz produkt
        </ButtonPrimary>
      </Container>
    </ScrollView>
  );
}

const PRODUCTS = [
  'Porcja',
  'Opakowanie',
  'Szklanka'
] as const;

const KEYBOARD_NUMERIC = 'numeric';

const Container = styled.KeyboardAvoidingView`
  padding: 20px;
`