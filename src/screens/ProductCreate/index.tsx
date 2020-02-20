import React, { useReducer, useRef, createRef, useEffect } from 'react';
import styled, { css } from 'styled-components/native';
import { BasicInput, BasicInputRef } from '../../components/BasicInput';
import {
  productCreateReducer,
  ProductCreateState,
  PortionOption,
  initProductCreateReducer,
} from './reducer';
import { TextInput, ScrollView, TouchableOpacity } from 'react-native';
import { InputRow } from '../../components/InputRow';
import { Options } from '../../components/Options';
import { NavigationScreenProps } from 'react-navigation';
import { useUserId } from '../../hooks';
import { Product, IProductRequired } from '../../database/entities';
import { parseNumber } from '../../common/utils';
import { ProductCreateParams } from './params';
import { useNavigationParams } from '../../hooks/useNavigationParams';
import { PORTION_TITLE, NUTRITION_INPUTS } from './consts';
import { useNavigation } from 'react-navigation-hooks';

interface ProductCreateProps extends
  NavigationScreenProps<ProductCreateParams, ProductCreateOptions> {}

export const ProductCreate = (props: ProductCreateProps) => {
  const params = useNavigationParams<ProductCreateParams>();
  const [state, dispatch] = useReducer(
    productCreateReducer,
    params,
    initProductCreateReducer
  );
  
  const userId = useUserId();
  const { current: refsList } = useRef({
    producer: createRef<TextInput>(),
    portion: createRef<TextInput>(),
    carbs: createRef<TextInput>(),
    prots: createRef<TextInput>(),
    fats: createRef<TextInput>(),
    kcal: createRef<TextInput>(),
    barcode: createRef<TextInput>(),
  });
  const navigation = useNavigation();

  function handleUpdate(payload: Partial<ProductCreateState>) {
    dispatch({
      type: 'UPDATE',
      payload
    });
  }

  async function handleProductCreate() {
    const {
      portionOption,
      portionOptions,
      portion,
      barcode,
      carbs,
      prots,
      fats,
      kcal,
      name,
      producer,
      ...data
    } = state;

    if (!name.length) {
      return;
    }

    const parsedProduct: IProductRequired = {
      ...data,
      name: name.trim(),
      barcode: barcode.length ? barcode : null,
      macro: {
        carbs: Number(carbs),
        prots: Number(prots),
        fats: Number(fats),
        kcal: Number(kcal),
      },
      userId,
    }

    // re-use Product.saveNormalizedProduct method

    if (
      params.operationType === 'edit' &&
      params.productToEdit
    ) {
      if (params.productToEdit instanceof Product) {
        const updatedProduct = await params.productToEdit.save(parsedProduct as any);
        // const updatedProduct = await Product.updateAndReturn(
        //   params.productToEdit.id,
        //   parsedProduct
        // );
        params.onProductEdited?.(updatedProduct);

      } else {
        const createdProduct = await Product.save(parsedProduct);
        params.onProductEdited?.(createdProduct);
      }

    } else if (params.operationType === 'create') {
      const createdProduct = await Product.save(parsedProduct);

      params.onProductCreated?.(createdProduct);
    }
  }
  
  useEffect(() => {
    navigation.setParams({ _handleProductCreate: handleProductCreate });
  }, [state]);

  function handlePortionOptionChange(option: PortionOption) {
    dispatch({
      type: 'SELECT_PORTION_OPTION',
      payload: option
    });
  }

  return (
    <ScrollView>
      <Container>
        <BasicInput
          label="Nazwa"
          accessibilityLabel="Nazwa produktu"
          value={state.name}
          onChangeText={name => handleUpdate({ name })}
          onSubmitEditing={refsList.producer.current?.focus}
        />
        <BasicInputRef
          label="Producent"
          accessibilityLabel="Producent"
          value={state.producer}
          onChangeText={producer => handleUpdate({ producer })}
          onSubmitEditing={refsList.portion.current?.focus}
          ref={refsList.producer}
        />
        <OptionsContainer>
          <InfoTitle>Wartości odżywcze na:</InfoTitle>
          <Options
            value={state.portionOptions}
            onChange={handlePortionOptionChange}
          />
        </OptionsContainer>
        <InputRow
          title={PORTION_TITLE[state.portionOption]}
          value={state.portion}
          onChangeText={portion => handleUpdate({ portion: parseNumber(portion, 10000, 6) })}
          onSubmitEditing={refsList.carbs.current?.focus}
          ref={refsList.portion}
          accessibilityLabel="Ilość produktu"
          styles={InputCss}
        />
        {NUTRITION_INPUTS.map(data => (
          <InputRow
            key={data.title}
            title={data.title}
            value={state[data.property]}
            onChangeText={value => handleUpdate({ [data.property]: parseNumber(value, 10000, 6) })}
            onSubmitEditing={refsList[data.nextRef].current?.focus}
            ref={refsList[data.property]}
            accessibilityLabel={data.title}
            styles={InputCss}
          />
        ))}
        <InputRow
          title="Kod kreskowy"
          keyboardType="default"
          ref={refsList.barcode}
          value={state.barcode as string}
          onChangeText={barcode => handleUpdate({ barcode })}
          onSubmitEditing={handleProductCreate}
          accessibilityLabel="Kod kreskowy"
          styles={InputCss}
        />
      </Container>
    </ScrollView>
  );
}

const Container = styled.KeyboardAvoidingView`
  padding: 20px;
`

const InfoTitle = styled.Text`
  text-align: center;
  font-size: ${props => props.theme.fontSize.regular};
  font-family: ${props => props.theme.fontWeight.regular};
`

const SaveButton = styled(TouchableOpacity)`
  margin-right: 10px;
`

const SaveText = styled.Text`
  font-family: ${props => props.theme.fontWeight.regular};
  color: ${props => props.theme.color.focus};
`

const OptionsContainer = styled.View`
  margin: 10px 0;
`

const InputCss = css`
  margin-bottom: 10px;
`

const navigationOptions: ProductCreateProps['navigationOptions'] = ({ navigation }) => ({
  headerTitle: 'Stwórz produkt',
  headerRight: (
    <SaveButton
      onPress={navigation.getParam('_handleProductCreate')}
      accessibilityLabel="Zapisz produkt"  
    >
      <SaveText>Zapisz</SaveText>
    </SaveButton>
  )
});

ProductCreate.navigationOptions = navigationOptions;
interface ProductCreateOptions {
  headerTitle: string
  headerRight: JSX.Element
}