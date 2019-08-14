import React, { useReducer, useRef, createRef, useEffect } from 'react';
import styled from 'styled-components/native';
import { BasicInput, BasicInputRef } from '../../components/BasicInput';
import { productCreateReducer, initialState, ProductCreateState, PortionOption } from './reducer';
import { TextInput, ScrollView, TouchableOpacity } from 'react-native';
import { Theme } from '../../common/theme';
import { MacroElement } from '../../types';
import { InputRow } from '../../components/InputRow';
import { useDispatch } from 'react-redux';
import * as Actions from '../../store/actions';
import { Options } from '../../components/Options';
import { NavigationScreenProps } from 'react-navigation';
import { useUserId } from '../../common/hooks';

interface ProductCreateProps extends NavigationScreenProps<ProductCreateParams, ProductCreateOptions> {}
export const ProductCreate = (props: ProductCreateProps) => {
  const [state, dispatch] = useReducer(productCreateReducer, initialState);
  const storeDispatch = useDispatch();
  const userId = useUserId();
  const { current: params } = useRef<ProductCreateParams>({
    onProductCreated: props.navigation.getParam('onProductCreated')
  });
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

    await storeDispatch(
      Actions.productCreate({
        ...data,
        barcode: barcode.length ? barcode : null,
        // quantity: data.portion,
        userId
      })
    );

    if (params.onProductCreated) {
      params.onProductCreated();
    }
  }
  
  useEffect(() => {
    props.navigation.setParams({ handleProductCreate });
  }, []);

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

const Container = styled.View<{
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
  onProductCreated?: () => void
  handleProductCreate?: () => void
}

interface ProductCreateOptions {
  headerTitle: string
  headerRight: JSX.Element
}