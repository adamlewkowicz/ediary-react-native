import React from 'react';
import styled from 'styled-components/native';
import { BasicOption } from '../BasicOption';

interface OptionsProps {
  value: {
    title: string
    value: string
    selected: boolean
  }[]
  onChange: (value: string) => void
}
/**
 * @todo make value generic (union type)
 */
export function Options({ onChange, ...props }: OptionsProps) {
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