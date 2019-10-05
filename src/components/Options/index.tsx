import React from 'react';
import styled from 'styled-components/native';
import { BasicOption } from '../BasicOption';

interface OptionsProps<T> {
  value: SingleOption<T>[]
  onChange: (value: T) => void
}

export function Options<T>({ onChange, ...props }: OptionsProps<T>) {
  return (
    <Container>
      {props.value.map(option => (
        <BasicOption
          key={option.title}
          title={option.title}
          value={option.selected}
          onChange={() => onChange(option.value)}
        />
      ))}
    </Container>
  );
}

const Container = styled.View`
  flex-direction: row;
  justify-content: space-around;
  margin: 15px 0;
`

interface SingleOption<T> {
  title: string
  value: T
  selected: boolean
}