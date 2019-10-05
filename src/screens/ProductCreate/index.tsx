import React, { useReducer, useRef, createRef, useEffect } from 'react';
import styled, { css } from 'styled-components/native';
import { BasicInput, BasicInputRef } from '../../components/BasicInput';
import {
  productCreateReducer,
  ProductCreateState,
  PortionOption,
  initProductCreateReducer
} from './reducer';
import { TextInput, ScrollView, TouchableOpacity } from 'react-native';
import { MacroElement, BarcodeId } from '../../types';
import { InputRow } from '../../components/InputRow';
import { Options } from '../../components/Options';
import { NavigationScreenProps } from 'react-navigation';
import { useUserId } from '../../hooks';
import { Product } from '../../database/entities';
import { parseNumber } from '../../common/utils';
import { useDispatch } from 'react-redux';
import { Actions } from '../../store';

interface ProductCreateProps extends NavigationScreenProps<ProductCreateParams, ProductCreateOptions> {}

export const ProductCreate = (props: ProductCreateProps) => {
  const { current: params } = useRef<ProductCreateParams>({
    onProductCreated: props.navigation.getParam('onProductCreated'),
    barcode: props.navigation.getParam('barcode'),
    name: props.navigation.getParam('name'),
  });
  const [state, dispatch] = useReducer(
    productCreateReducer,
    params,
    initProductCreateReducer
  );
  const storeDispatch = useDispatch();
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
      ...data
    } = state;

    if (!data.name.length) {
      return;
    }

    const newProduct = await Product.save({
      ...data,
      name: data.name.trim(),
      barcode: barcode.length ? barcode : null,
      userId,
      macro: {
        carbs: Number(carbs),
        prots: Number(prots),
        fats: Number(fats),
        kcal: Number(kcal),
      }
    });

    storeDispatch(
      Actions.productHistoryRecentAdded([newProduct])
    );

    if (params.onProductCreated) {
      params.onProductCreated(newProduct);
    }
  }
  
  useEffect(() => {
    props.navigation.setParams({ handleProductCreate });
  }, [state]);

  function handlePortionOptionChange(option: PortionOption) {
    dispatch({
      type: 'SELECT_PORTION_OPTION',
      payload: option
    });
  }

  return (
    <ScrollView>
      <Container behavior="padding">
        <BasicInput
          label="Nazwa"
          accessibilityLabel="Nazwa produktu"
          value={state.name}
          onChangeText={name => handleUpdate({ name })}
          onSubmitEditing={() => refsList.producer.current!.focus()}
        />
        <BasicInputRef
          label="Producent"
          accessibilityLabel="Producent"
          value={state.producer}
          onChangeText={producer => handleUpdate({ producer })}
          onSubmitEditing={() => refsList.portion.current!.focus()}
          ref={refsList.producer}
        />
        <OptionsContainer>
          <InfoTitle>Wartości odżywcze na:</InfoTitle>
          <Options
            value={state.portionOptions}
            onChange={option => handlePortionOptionChange(option)}
          />
        </OptionsContainer>
        <InputRow
          title={portionTitle[state.portionOption]}
          value={state.portion}
          onChangeText={portion => handleUpdate({ portion: parseNumber(portion, 10000, 6) })}
          onSubmitEditing={() => refsList.carbs.current!.focus()}
          ref={refsList.portion}
          accessibilityLabel="Ilość produktu"
          css={InputCss}
        />
        {nutritionInputs.map(data => (
          <InputRow
            key={data.title}
            title={data.title}
            value={state[data.property]}
            onChangeText={value => handleUpdate({ [data.property]: parseNumber(value, 10000, 6) })}
            onSubmitEditing={() => refsList[data.nextRef].current!.focus()}
            ref={refsList[data.property]}
            accessibilityLabel={data.title}
            css={InputCss}
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
          css={InputCss}
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

const portionTitle = {
  '100g': 'Opakowanie zawiera',
  'portion': 'Porcja zawiera',
  'package': 'Opakowanie zawiera'
}

const nutritionInputs: {
  title: string
  property: MacroElement
  nextRef: MacroElement | 'barcode'
}[] = [
  {
    title: 'Węglowodany',
    property: 'carbs',
    nextRef: 'prots'
  },
  {
    title: 'Białka',
    property: 'prots',
    nextRef: 'fats'
  },
  {
    title: 'Tłuszcze',
    property: 'fats',
    nextRef: 'kcal'
  },
  {
    title: 'Kalorie',
    property: 'kcal',
    nextRef: 'barcode'
  }
]

const navigationOptions: ProductCreateProps['navigationOptions'] = ({ navigation }) => ({
  headerTitle: 'Stwórz produkt',
  headerRight: (
    <SaveButton
      onPress={navigation.getParam('handleProductCreate')}
      accessibilityLabel="Zapisz produkt"  
    >
      <SaveText>Zapisz</SaveText>
    </SaveButton>
  )
});

ProductCreate.navigationOptions = navigationOptions;

export interface ProductDataParams {
  barcode?: BarcodeId
  name?: string
}
export interface ProductCreateParams extends ProductDataParams {
  onProductCreated?: (product: Product) => void
  handleProductCreate?: () => void
}

interface ProductCreateOptions {
  headerTitle: string
  headerRight: JSX.Element
}