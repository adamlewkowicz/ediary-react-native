import React, { useReducer, useRef, createRef } from 'react';
import styled from 'styled-components/native';
import { BasicInput, BasicInputRef } from '../../components/BasicInput';
import { formReducer, initialState, FormReducerState } from './reducer';
import { Text, TextInput } from 'react-native';
import { Theme } from '../../common/theme';
import { BasicOption } from '../../components/BasicOption';
import { MacroElement } from '../../types';

const nutritionInputs: {
  title: string
  titleOptions?: {
    [key in FormReducerState['nutritionFor']]: string
  }
  property: MacroElement | 'quantity'
}[] = [
  {
    title: 'Opakowanie zawiera',
    property: 'quantity',
    titleOptions: {
      '100g': 'Opakowanie zawiera',
      'portion': 'Porcja zawiera',
      'package': 'Opakowanie zawiera'
    }
  },
  {
    title: 'Węglowodany',
    property: 'carbs',
  },
  {
    title: 'Białka',
    property: 'prots'
  },
  {
    title: 'Tłuszcze',
    property: 'fats'
  },
  {
    title: 'Kalorie',
    property: 'kcal'
  }
]

export const ProductCreate = () => {
  const [state, dispatch] = useReducer(formReducer, initialState);
  const { current: refsList } = useRef({
    producer: createRef<TextInput>(),
    quantity: createRef<TextInput>(),
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

  return (
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
        onSubmitEditing={() => refsList.quantity.current!.focus()}
        ref={refsList.producer}
      />
      <InfoTitle>Wartości odżywcze na:</InfoTitle>
      <OptionsContainer>
        <BasicOption
          title="100g"
          value={state.nutritionFor === '100g'}
          onChange={() => handleUpdate({ nutritionFor: '100g' })}
        />
        <BasicOption
          title="porcję"
          value={state.nutritionFor === 'portion'}
          onChange={() => handleUpdate({ nutritionFor: 'portion' })}
        />
        <BasicOption
          title="opakowanie"
          value={state.nutritionFor === 'package'}
          onChange={() => handleUpdate({ nutritionFor: 'package' })}
        />
      </OptionsContainer>
      {nutritionInputs.map((data, index) => (
        <NutriRow key={data.title}>
          <NutriInfo>
            {data.titleOptions ? data.titleOptions[state.nutritionFor] : data.title}
          </NutriInfo>
          <BasicInputRef
            minWidth={100}
            textAlign="center"
            keyboardType="numeric"
            value={state[data.property].toString()}
            onChangeText={value => handleUpdate({ [data.property]: Number(value) })}
            onSubmitEditing={() => refsList[nutritionInputs[index + 1].property].current!.focus()}
            ref={refsList[data.property]}
          />
        </NutriRow>
      ))}
    </Container>
  );
}

const Container = styled.View<{
  theme: Theme
}>`
  padding: 20px;
`

const OptionsContainer = styled.View`
  flex-direction: row;
  justify-content: space-around;
  margin: 15px 0;
`

const InfoTitle = styled.Text<{
  theme: Theme
}>`
  text-align: center;
  font-size: ${props => props.theme.fontSize};
  font-family: ${props => props.theme.fontFamily};
`

const NutriRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`

const NutriInfo = styled.Text<{
  theme: Theme
}>`
  font-size: ${props => props.theme.fontSize};
  font-family: ${props => props.theme.fontFamily};
`