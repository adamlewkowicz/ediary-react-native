import React, { useReducer, useRef, createRef, useEffect } from 'react';
import styled from 'styled-components/native';
import { BasicInput, BasicInputRef } from '../../components/BasicInput';
import {
  productCreateReducer,
  ProductCreateState,
  PortionOption,
  initProductCreateReducer
} from './reducer';
import { TextInput, ScrollView, TouchableOpacity } from 'react-native';
import { Theme } from '../../common/theme';
import { MacroElement, BarcodeId } from '../../types';
import { InputRow } from '../../components/InputRow';
import { Options } from '../../components/Options';
import { NavigationScreenProps } from 'react-navigation';
import { useUserId } from '../../common/hooks';
import { Product } from '../../database/entities';

interface ProductCreateProps extends NavigationScreenProps<ProductCreateParams, ProductCreateOptions> {}
export const ProductCreate = (props: ProductCreateProps) => {
  const { current: params } = useRef<ProductCreateParams>({
    onProductCreated: props.navigation.getParam('onProductCreated'),
    barcode: props.navigation.getParam('barcode')
  });
  const [state, dispatch] = useReducer(
    productCreateReducer,
    params.barcode,
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

  function handleUpdate(payload: Partial<ProductCreateState>) {
    dispatch({
      type: 'UPDATE',
      payload
    });
  }

  async function handleProductCreate() {
    const { portionOption, portionOptions, barcode, ...data } = state;

    if (!data.name.length) {
      return;
    }

    const newProduct = await Product.save({
      ...data,
      name: data.name.trim(),
      barcode: barcode.length ? barcode : null,
      userId
    });

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
          value={state.name}
          onChangeText={name => handleUpdate({ name })}
          onSubmitEditing={() => refsList.producer.current!.focus()}
        />
        <BasicInputRef
          label="Producent"
          value={state.producer}
          onChangeText={producer => handleUpdate({ producer })}
          onSubmitEditing={() => refsList.portion.current!.focus()}
          ref={refsList.producer}
        />
        <InfoTitle>Wartości odżywcze na:</InfoTitle>
        <Options
          value={state.portionOptions}
          /** Temporary */
          onChange={(option: any) => handlePortionOptionChange(option)}
        />
        <InputRow
          title={portionTitle[state.portionOption]}
          value={state.portion.toString()}
          onChangeText={portion => handleUpdate({ portion: Number(portion) })}
          onSubmitEditing={() => refsList.carbs.current!.focus()}
          ref={refsList.portion}
        />
        {nutritionInputs.map(data => (
          <InputRow
            key={data.title}
            title={data.title}
            value={state[data.property].toString()}
            onChangeText={value => handleUpdate({ [data.property]: Number(value) })}
            onSubmitEditing={() => refsList[data.nextRef].current!.focus()}
            ref={refsList[data.property]}
          />
        ))}
        <InputRow
          title="Kod kreskowy"
          keyboardType="default"
          ref={refsList.barcode}
          value={state.barcode as string}
          onChangeText={barcode => handleUpdate({ barcode })}
          onSubmitEditing={handleProductCreate}
        />
      </Container>
    </ScrollView>
  );
}

const Container = styled.KeyboardAvoidingView<{
  theme: Theme
}>`
  padding: 20px;
`

const InfoTitle = styled.Text<{
  theme: Theme
}>`
  text-align: center;
  font-size: ${props => props.theme.fontSize};
  font-family: ${props => props.theme.fontFamily};
`

const SaveButton = styled(TouchableOpacity)`
  margin-right: 10px;
`

const SaveText = styled.Text<{
  theme: Theme
}>`
  font-family: ${props => props.theme.fontFamily};
  color: ${props => props.theme.focusColor};
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
    <SaveButton onPress={navigation.getParam('handleProductCreate')}>
      <SaveText>Zapisz</SaveText>
    </SaveButton>
  )
});

ProductCreate.navigationOptions = navigationOptions;

export interface ProductCreateParams {
  onProductCreated?: (product: Product) => void
  handleProductCreate?: () => void
  barcode?: BarcodeId
}

interface ProductCreateOptions {
  headerTitle: string
  headerRight: JSX.Element
}