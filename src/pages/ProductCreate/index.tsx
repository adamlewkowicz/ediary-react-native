import React, { useReducer, useRef } from 'react';
import styled from 'styled-components/native';
import { BasicInput, BasicInputRef } from '../../components/BasicInput';
import { formReducer, initialState, FormReducerState } from './reducer';
import { Text, TextInput } from 'react-native';
import { Theme } from '../../common/theme';
import { BasicOption } from '../../components/BasicOption';

const quantityTitle = {

}

export const ProductCreate = () => {
  const [state, dispatch] = useReducer(formReducer, initialState);
  const producerInputRef = useRef<TextInput>(null);
  const quantityInputRef = useRef<TextInput>(null);
  const carbsInputRef = useRef<TextInput>(null);

  function handlePropertyUpdate(value: any, property: any) {
    dispatch({
      type: 'UPDATE_PROPERTY',
      payload: value,
      meta: { key: property }
    });
  }

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
        onSubmitEditing={() => producerInputRef.current!.focus()}
      />
      <BasicInputRef
        label="Producent"
        value={state.producer}
        onChangeText={producer => handleUpdate({ producer })}
        onSubmitEditing={() => quantityInputRef.current!.focus()}
        ref={producerInputRef}
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
      <NutriRow>
        <NutriInfo>Opakowanie zawiera</NutriInfo>
        <BasicInputRef
          minWidth={100}
          textAlign="center"
          keyboardType="numeric"
          value={state.quantity.toString()}
          onChangeText={quantity => handleUpdate({ quantity: Number(quantity) })}
          onSubmitEditing={() => carbsInputRef.current!.focus()}
          ref={quantityInputRef}
        />
      </NutriRow>
      <NutriRow>
        <NutriInfo>Węglowodany</NutriInfo>
        <BasicInputRef
          minWidth={100}
          textAlign="center"
          keyboardType="numeric"
          value={state.carbs.toString()}
          onChangeText={carbs => handleUpdate({ carbs: Number(carbs) })}
          ref={carbsInputRef}
        />
      </NutriRow>
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