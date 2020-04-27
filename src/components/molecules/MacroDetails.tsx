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
      <Value>
        {props.value.toFixed(0)}g
      </Value>
    </Container>
  );
}

const Container = styled.View`
  flex-direction: row;
  align-items: center;
  margin-right: 16px;
  min-width: 45px;
`

const Stripe = styled.View<{
  color: string
}>`
  background-color: ${props => props.color};
  width: 1px;
  height: 100%;
  margin-right: ${props => props.theme.spacing.micro};
`

const Value = styled(TextPrimary)`
  font-size: ${props => props.theme.fontSize.small};
`

const Title = styled(H4)<{
  color: string
}>`
  margin-right: ${props => props.theme.spacing.tiny};
  color: ${props => props.color};
`