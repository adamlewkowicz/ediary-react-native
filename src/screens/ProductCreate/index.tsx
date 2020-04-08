import React, { useRef, useState } from 'react';
import styled from 'styled-components/native';
import { TextInput, ScrollView } from 'react-native';
import { useUserId, useNavigationData, useAppError } from '../../hooks';
import { Product } from '../../database/entities';
import { ProductCreateScreenNavigationProps } from '../../navigation';
import {
  Section,
  Group,
  InputButton,
  InputMetaText,
  InputForm,
  ButtonPrimary,
} from '../../components';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import * as Utils from '../../utils';
import { ProductUnitType } from '../../types';

interface ProductCreateScreenProps {}

export const ProductCreateScreen = (props: ProductCreateScreenProps) => {
  const { params, navigation, navigate } = useNavigationData<ProductCreateScreenNavigationProps>();
  const [portionUnitType] = useState<ProductUnitType>('g');
  const [isLoading, setIsLoading] = useState(false);
  const { setAppError } = useAppError();
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

  const formik = useFormik({
    initialValues: INITIAL_VALUES,
    validationSchema: getValidationSchema(portionUnitType),
    async onSubmit(values) {
      try {
        if (isLoading) return;

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
    }
  });

  const handleSubmit = (): void => formik.handleSubmit();

  const handleCaloriesEvaluation = (): void => {
    const calcedKcal = Utils.calculateCaloriesByMacro({
      carbs: Number(formik.values.carbs),
      prots: Number(formik.values.prots),
      fats: Number(formik.values.fats)
    });

    if (!Number.isNaN(calcedKcal)) {
      formik.setFieldValue('kcal', String(calcedKcal));
    }
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
        <InputForm
          label="Nazwa"
          placeholder="Mleko UHT 3.2 %"
          formik={formik}
          formikProperty="name"
          onSubmitEditing={brandInputRef.current?.focus}
        />
        <InputForm
          label="Marka"
          placeholder="Łaciate"
          ref={brandInputRef}
          formik={formik}
          formikProperty="brand"
          onSubmitEditing={producerInputRef.current?.focus}
        />
        <InputForm
          label="Producent"
          placeholder="Mlekovita"
          ref={producerInputRef}
          formik={formik}
          formikProperty="producer"
          onSubmitEditing={portionQuantityInputRef.current?.focus}
        />
        <InputMetaText
          label={`Ilość ${portionUnitType} w jednej porcji`}
          placeholder="100"
          value={formik.values.portionQuantity}
          onChangeText={formik.handleChange('portionQuantity') as any}
          onBlur={formik.handleBlur('portionQuantity') as any}
          metaText={portionUnitType}
          keyboardType="numeric"
          ref={portionQuantityInputRef}
          onSubmitEditing={carbsInputRef.current?.focus}
          error={formik.errors.portionQuantity}
          isDirty={formik.touched.portionQuantity}
        />
      </Section>
      <Section
        title="Makroskładniki"
        description={`Na 100${portionUnitType} produtku`}
      >
        <Group.Container>
          <InputForm
            label="Węglowodany"
            placeholder="0"
            formik={formik}
            formikProperty="carbs"
            keyboardType="numeric"
            ref={carbsInputRef}
            onSubmitEditing={sugarsInputRef.current?.focus}
          />
          <Group.Separator />
          <InputForm
            formik={formik}
            formikProperty="sugars"
            label="w tym cukry"
            placeholder="0"
            keyboardType="numeric"
            ref={sugarsInputRef}
            onSubmitEditing={protsInputRef.current?.focus}
          />
        </Group.Container>
        <InputMetaText
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
          <InputForm
            label="Tłuszcze"
            placeholder="0"
            keyboardType="numeric"
            formik={formik}
            formikProperty="fats"
            ref={fatsInputRef}
            onSubmitEditing={fattyAcidsInputRef.current?.focus}
          />
          <Group.Separator />
          <InputForm
            label="w tym kwasy tłuszczowe"
            placeholder="0"
            keyboardType="numeric"
            formik={formik}
            formikProperty="fattyAcids"
            ref={fattyAcidsInputRef}
            onSubmitEditing={kcalInputRef.current?.focus}
          />
        </Group.Container>
        <InputButton
          value={formik.values.kcal}
          onChangeText={formik.handleChange('kcal') as any}
          onBlur={formik.handleBlur('kcal') as any}
          label="Kalorie"
          placeholder="0"
          buttonText="Oblicz"
          buttonLabel="Oblicz kalorie"
          keyboardType="numeric"
          onButtonPress={handleCaloriesEvaluation}
          ref={kcalInputRef}
          onSubmitEditing={barcodeInputRef.current?.focus}
          error={formik.errors.kcal}
          isDirty={formik.touched.kcal}
        />
      </Section>
      <Section title="Inne">
        <InputButton
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

const Container = styled(ScrollView)`
  padding: 0 20px;
`

const SaveProductButton = styled(ButtonPrimary)`
  margin-bottom: 20px;
`

const INITIAL_VALUES = {
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
};

const MAX_PORTION_QUANTITY = 2000;

const MIN_PRODUCT_NAME = 3;

const getValidationSchema = (portionUnitType: ProductUnitType) => Yup.object({
  name: Yup.string()
    .min(MIN_PRODUCT_NAME, `Nazwa powinna zawierać min. ${MIN_PRODUCT_NAME} znaki`)
    .required('Nazwa jest wymagana'),
  brand: Yup.string(),
  producer: Yup.string(),
  portionQuantity: Yup
    .number()
    .max(
      MAX_PORTION_QUANTITY,
      `Maksymalna ilość w jednej porcji to ${MAX_PORTION_QUANTITY} ${portionUnitType}`
    ),
  carbs: Yup.number(),
  sugars: Yup.number(),
  prots: Yup.number(),
  fats: Yup.number(),
  fattyAcids: Yup.number(),
  kcal: Yup.number(),
  barcode: Yup.string(),
});

type FormData = typeof INITIAL_VALUES;

const normalizeProductData = (productData: FormData) => {
  const { fattyAcids, sugars, ...restData } = productData;

  const macro = {
    carbs: Number(productData.carbs),
    prots: Number(productData.prots),
    fats: Number(productData.fats),
    kcal: Number(productData.kcal)
  }

  const barcode = productData.barcode.length ? productData.barcode : null;
  const portionQuantity = Number(productData.portionQuantity);

  const product = {
    ...restData,
    macro,
    barcode,
    portionQuantity,
  }

  return product;
}