import React, { useReducer, useRef, createRef } from 'react';
import styled from 'styled-components/native';
import { BasicInput, BasicInputRef } from '../../components/BasicInput';
import { formReducer, initialState, FormReducerState, PortionOption } from './reducer';
import { TextInput, ScrollView } from 'react-native';
import { Theme } from '../../common/theme';
import { MacroElement } from '../../types';
import { InputRow } from '../../components/InputRow';
import { useDispatch } from 'react-redux';
import * as Actions from '../../store/actions';
import { Options } from '../../components/Options';

export const ProductCreate = () => {
  const [state, dispatch] = useReducer(formReducer, initialState);
  const storeDispatch = useDispatch();
  const { current: refsList } = useRef({
    producer: createRef<TextInput>(),
    portion: createRef<TextInput>(),
    carbs: createRef<TextInput>(),
    prots: createRef<TextInput>(),
    fats: createRef<TextInput>(),
    kcal: createRef<TextInput>(),
    barcode: createRef<TextInput>(),
  });

  function handleUpdate(payload: Partial<FormReducerState>) {
    dispatch({
      type: 'UPDATE',
      payload
    });
  }

  function handleProductCreate() {
    const { portionOption, portionOptions, ...data } = state;

    storeDispatch(
      Actions.productCreate({
        ...data,
        quantity: data.portion
      })
    );
  }

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