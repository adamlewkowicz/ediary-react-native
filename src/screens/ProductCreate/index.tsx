import React, { useReducer, useRef, useState } from 'react';
import styled from 'styled-components/native';
import {
  productCreateReducer,
  initProductCreateReducer,
  normalizeProductData,
} from './reducer';
import { TextInput, ScrollView } from 'react-native';
import { useUserId, useNavigationData, useAppError } from '../../hooks';
import { Product } from '../../database/entities';
import { ProductCreateScreenNavigationProps } from '../../navigation';
import {
  Section,
  Group,
  ButtonPrimary,
  InputRef,
  InputButtonRef,
  InputMetaTextRef,
} from '../../components';
import { useFormik } from 'formik';
import * as Yup from 'yup';

interface ProductCreateScreenProps {}

export const ProductCreateScreen = (props: ProductCreateScreenProps) => {
  const { params, navigation, navigate } = useNavigationData<ProductCreateScreenNavigationProps>();
  const [state, dispatch] = useReducer(
    productCreateReducer,
    params,
    initProductCreateReducer
  );
  const userId = useUserId();
  const [isLoading, setIsLoading] = useState(false);
  const { setAppError } = useAppError();

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

  const formik = useFormik({
    initialValues: {
      name: '',
      brand: '',
      producer: '',
      portionQuantity: '',
      carbs: '',
      sugars: '',
      prots: '',
      fats: '',
      fattyAcids: '',
      kcal: '',
      barcode: '',
    },
    async onSubmit(values) {
      try {
        setIsLoading(true);

        const { portionQuantity, ...productData } = normalizeProductData(values);
        const productWithUserId = { ...productData, userId };
    
        const createdProduct = await Product.saveWithPortion(productWithUserId, portionQuantity);
    
        params.onProductCreated?.(createdProduct);

      } catch(error) {
        setAppError(error);
      } finally {
        setIsLoading(false);
      }
    },
    validationSchema: Yup.object({
      name: Yup.string()
        .min(MIN_PRODUCT_NAME, `Nazwa powinna zawierać min. ${MIN_PRODUCT_NAME} znaki`)
        .required('Nazwa jest wymagana'),
      brand: Yup.string(),
      producer: Yup.string(),
      portionQuantity: Yup
        .number()
        .max(
          MAX_PORTION_QUANTITY,
          `Maksymalna ilość w jednej porcji to ${MAX_PORTION_QUANTITY} ${state.portionUnitType}`
        ),
      carbs: Yup.number(),
      sugars: Yup.number(),
      prots: Yup.number(),
      fats: Yup.number(),
      fattyAcids: Yup.number(),
      kcal: Yup.number(),
      barcode: Yup.string(),
    })
  });

  const handleSubmit = (): void => {
    formik.handleSubmit();
  }

  const handleCaloriesEvaluation = (): void => {
    dispatch({ type: 'CALORIES_EVALUATED' });
  }
  
  const handleBarcodeScanNavigation = (): void => {
    navigate('BarcodeScan', {
      onBarcodeDetected(barcode) {
        navigation.goBack();
        formik.setFieldValue('barcode', barcode);
      }
    });
  }

  return (
    <Container keyboardShouldPersistTaps="handled">
      <Section title="Podstawowe dane">
        <InputRef 
          label="Nazwa"
          placeholder="Mleko UHT 3.2 %"
          value={formik.values.name}
          onChangeText={formik.handleChange('name') as any}
          onBlur={formik.handleBlur('name') as any}
          onSubmitEditing={brandInputRef.current?.focus}
          error={formik.errors.name}
          isDirty={formik.touched.name}
        />
        <InputRef
          ref={brandInputRef}
          label="Marka"
          placeholder="Łaciate"
          value={formik.values.brand}
          onChangeText={formik.handleChange('brand') as any}
          onBlur={formik.handleBlur('brand') as any}
          onSubmitEditing={producerInputRef.current?.focus}
          error={formik.errors.brand}
          isDirty={formik.touched.brand}
        />
        <InputRef 
          label="Producent"
          placeholder="Mlekovita"
          value={formik.values.producer}
          onChangeText={formik.handleChange('producer') as any}
          onBlur={formik.handleBlur('producer') as any}
          ref={producerInputRef}
          onSubmitEditing={portionQuantityInputRef.current?.focus}
          error={formik.errors.producer}
          isDirty={formik.touched.producer}
        />
        <InputMetaTextRef
          label="Ilość w jednej porcji"
          placeholder="100"
          value={formik.values.portionQuantity}
          onChangeText={formik.handleChange('portionQuantity') as any}
          onBlur={formik.handleBlur('portionQuantity') as any}
          metaText={state.portionUnitType}
          keyboardType="numeric"
          ref={portionQuantityInputRef}
          onSubmitEditing={carbsInputRef.current?.focus}
          error={formik.errors.portionQuantity}
          isDirty={formik.touched.portionQuantity}
        />
      </Section>
      <Section
        title="Makroskładniki"
        description={`Na 100${state.portionUnitType} produtku`}
      >
        <Group.Container>
          <InputRef
            value={formik.values.carbs}
            onChangeText={formik.handleChange('carbs') as any}
            onBlur={formik.handleBlur('carbs') as any}
            label="Węglowodany"
            placeholder="0"
            keyboardType="numeric"
            ref={carbsInputRef}
            onSubmitEditing={sugarsInputRef.current?.focus}
            error={formik.errors.carbs}
            isDirty={formik.touched.carbs}
          />
          <Group.Separator />
          <InputRef
            value={formik.values.sugars}
            onChangeText={formik.handleChange('sugars') as any}
            onBlur={formik.handleBlur('sugars') as any}
            label="w tym cukry"
            placeholder="0"
            keyboardType="numeric"
            ref={sugarsInputRef}
            onSubmitEditing={protsInputRef.current?.focus}
            error={formik.errors.sugars}
            isDirty={formik.touched.sugars}
          />
        </Group.Container>
        <InputMetaTextRef
          value={formik.values.prots}
          onChangeText={formik.handleChange('prots') as any}
          onBlur={formik.handleBlur('prots') as any}
          label="Białko"
          placeholder="0"
          metaText="g"
          keyboardType="numeric"
          ref={protsInputRef}
          onSubmitEditing={fatsInputRef.current?.focus}
          error={formik.errors.prots}
          isDirty={formik.touched.prots}
        />
        <Group.Container>
          <InputRef
            value={formik.values.fats}
            onChangeText={formik.handleChange('fats') as any}
            onBlur={formik.handleBlur('fats') as any}
            label="Tłuszcze"
            placeholder="0"
            keyboardType="numeric"
            ref={fatsInputRef}
            onSubmitEditing={fattyAcidsInputRef.current?.focus}
            error={formik.errors.fats}
            isDirty={formik.touched.fats}
          />
          <Group.Separator />
          <InputRef
            value={formik.values.fattyAcids}
            onChangeText={formik.handleChange('fattyAcids') as any}
            onBlur={formik.handleBlur('fattyAcids') as any}
            label="w tym kwasy tłuszczowe"
            placeholder="0"
            keyboardType="numeric"
            ref={fattyAcidsInputRef}
            onSubmitEditing={kcalInputRef.current?.focus}
            error={formik.errors.fattyAcids}
            isDirty={formik.touched.fattyAcids}
          />
        </Group.Container>
        <InputButtonRef
          value={formik.values.kcal}
          onChangeText={formik.handleChange('kcal') as any}
          onBlur={formik.handleBlur('kcal') as any}
          label="Kalorie"
          placeholder="0"
          buttonText="Oblicz"
          keyboardType="numeric"
          onButtonPress={handleCaloriesEvaluation}
          ref={kcalInputRef}
          onSubmitEditing={barcodeInputRef.current?.focus}
          error={formik.errors.kcal}
          isDirty={formik.touched.kcal}
        />
      </Section>
      <Section title="Inne">
        <InputButtonRef
          value={formik.values.barcode}
          onChangeText={formik.handleChange('barcode') as any}
          onBlur={formik.handleBlur('barcode') as any}
          label="Kod kreskowy"
          placeholder="5900512300108"
          buttonText="Zeskanuj"
          onButtonPress={handleBarcodeScanNavigation}
          ref={barcodeInputRef}
          error={formik.errors.barcode}
          isDirty={formik.touched.barcode}
        />
      </Section>
      <SaveProductButton
        accessibilityLabel="Zapisz produkt"
        onPress={handleSubmit}
        isLoading={isLoading}
      >
        Zapisz produkt
      </SaveProductButton>
    </Container>
  );
}

const KEYBOARD_NUMERIC = 'numeric';

const MAX_PORTION_QUANTITY = 2000;

const MIN_PRODUCT_NAME = 3;

const Container = styled(ScrollView)`
  padding: 0 20px;
`

const SaveProductButton = styled(ButtonPrimary)`
  margin-bottom: 20px;
`