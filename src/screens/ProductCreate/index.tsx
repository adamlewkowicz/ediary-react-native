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
  ButtonPrimary,
  Input,
} from '../../components';
import { useFormik } from 'formik';
import * as Utils from '../../utils';
import { bindFormikProps } from '../../utils';
import { ProductUnitType } from '../../types';
import {
  deserializeProduct,
  serializeProduct,
  FormData,
  getValidationSchema,
} from './utils';

export const ProductCreateScreen = () => {
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

  const handleFormSubmit = async (values: FormData): Promise<void> => {
    try {
      if (isLoading) return;

      setIsLoading(true);

      const { portionQuantity, product: productData } = deserializeProduct(values);
      const productWithUserId = { ...productData, userId };

      if (params.onProductEdited && params.product) {

        const updatedOrCreatedProduct = await Product.updateOrCreate({
          originalProduct: params.product,
          updateProductData: productData,
          portionQuantity,
          userId,
        });

        params.onProductEdited(updatedOrCreatedProduct);
        
      } else if (params.onProductCreated) {
        const createdProduct = await Product.saveWithPortion(productWithUserId, portionQuantity);

        params.onProductCreated(createdProduct);
      }

    } catch(error) {
      setAppError(error);
    } finally {
      setIsLoading(false);
    }
  }

  const formik = useFormik({
    initialValues: serializeProduct(params.product),
    validationSchema: getValidationSchema(portionUnitType),
    onSubmit: handleFormSubmit,
  });

  const handleCaloriesEvaluation = (): void => {
    const calcedKcal = Utils.calculateCaloriesByMacro({
      carbs: Number(formik.values.carbs),
      prots: Number(formik.values.prots),
      fats: Number(formik.values.fats)
    });

    if (Utils.isANumber(calcedKcal)) {
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
        <Input
          {...bindFormikProps(formik, 'name')}
          label="Nazwa"
          placeholder="Mleko UHT 3.2 %"
          onSubmitEditing={brandInputRef.current?.focus}
        />
        <Input
          {...bindFormikProps(formik, 'brand')}
          label="Marka"
          placeholder="Łaciate"
          ref={brandInputRef}
          onSubmitEditing={producerInputRef.current?.focus}
        />
        <Input
          {...bindFormikProps(formik, 'producer')}
          label="Producent"
          placeholder="Mlekovita"
          ref={producerInputRef}
          onSubmitEditing={portionQuantityInputRef.current?.focus}
        />
        <InputMetaText
          {...bindFormikProps(formik, 'portionQuantity')}
          label={`Ilość ${portionUnitType} w jednej porcji`}
          placeholder="100"
          metaText={portionUnitType}
          keyboardType="numeric"
          ref={portionQuantityInputRef}
          onSubmitEditing={carbsInputRef.current?.focus}
        />
      </Section>
      <Section
        title="Makroskładniki"
        description={`Na 100${portionUnitType} produtku`}
      >
        <Group.Container>
          <Input
            {...bindFormikProps(formik, 'carbs')}
            label="Węglowodany"
            placeholder="0"
            keyboardType="numeric"
            ref={carbsInputRef}
            onSubmitEditing={sugarsInputRef.current?.focus}
          />
          <Group.Separator />
          <Input
            {...bindFormikProps(formik, 'sugars')}
            label="w tym cukry"
            placeholder="0"
            keyboardType="numeric"
            ref={sugarsInputRef}
            onSubmitEditing={protsInputRef.current?.focus}
          />
        </Group.Container>
        <InputMetaText
          {...bindFormikProps(formik, 'prots')}
          label="Białko"
          placeholder="0"
          metaText="g"
          keyboardType="numeric"
          ref={protsInputRef}
          onSubmitEditing={fatsInputRef.current?.focus}
        />
        <Group.Container>
          <Input
            {...bindFormikProps(formik, 'fats')}
            label="Tłuszcze"
            placeholder="0"
            keyboardType="numeric"
            ref={fatsInputRef}
            onSubmitEditing={fattyAcidsInputRef.current?.focus}
          />
          <Group.Separator />
          <Input
            {...bindFormikProps(formik, 'fattyAcids')}
            label="w tym kwasy tłuszczowe"
            placeholder="0"
            keyboardType="numeric"
            ref={fattyAcidsInputRef}
            onSubmitEditing={kcalInputRef.current?.focus}
          />
        </Group.Container>
        <InputButton
          {...bindFormikProps(formik, 'kcal')}
          label="Kalorie"
          placeholder="0"
          buttonText="Oblicz"
          buttonLabel="Oblicz kalorie"
          keyboardType="numeric"
          onButtonPress={handleCaloriesEvaluation}
          ref={kcalInputRef}
          onSubmitEditing={barcodeInputRef.current?.focus}
        />
      </Section>
      <Section title="Inne">
        <InputButton
          {...bindFormikProps(formik, 'barcode')}
          label="Kod kreskowy"
          placeholder="5900512300108"
          buttonText="Zeskanuj"
          onButtonPress={handleBarcodeScanNavigation}
          ref={barcodeInputRef}
        />
      </Section>
      <SaveProductButton
        onPress={() => formik.handleSubmit()}
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