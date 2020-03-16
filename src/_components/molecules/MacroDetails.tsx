import React from 'react';
import styled from 'styled-components/native';
import { TextPrimary, H4 } from '../atoms/Text';

interface MacroDetailsProps {
  color: string
  title: string
  value: number
}

export const MacroDetails = (props: MacroDetailsProps) => {
  return (
    <Container>
      <Stripe color={props.color} />
      <Title color={props.color}>{props.title}</Title>
      <TextPrimary>
        {props.value.toFixed(0)} g
      </TextPrimary>
    </Container>
  );
}

const Container = styled.View`
  flex-direction: row;
  align-items: center;
  /* width: 140px; */
`

const Stripe = styled.View<{
  color: string
}>`
  background-color: ${props => props.color};
  width: 1px;
  height: 100%;
  margin-right: 4px;
`

const Title = styled(H4)<{
  color: string
}>`
  margin-right: 5px;
  color: ${props => props.color};
`