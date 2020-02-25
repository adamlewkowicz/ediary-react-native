import React from 'react';
import styled from 'styled-components/native';
import { FontWeightProperty } from 'csstype';

interface TextMetaProps {
  value: string | number
  meta: string
  valueFontSize?: number
  valueFontWeight?: FontWeightProperty
  metaFontSize?: number
  marginTop?: string
  marginBottom?: string
  color?: string
}

export const TextMeta = ({
  color = '#000',
  ...props
}: TextMetaProps) => (
  <Container
    marginTop={props.marginTop}
    marginBottom={props.marginBottom}
  >
    <Value
      fontSize={props.valueFontSize}
      fontWeight={props.valueFontWeight}
      color={color}
    >
      {props.value}
    </Value>
    <Meta
      fontSize={props.metaFontSize}
      color={color}
    >
      {props.meta}
    </Meta>
  </Container>
);

const Container = styled.View<{
  marginTop?: string
  marginBottom?: string
}>`
  display: flex;
  flex-direction: row;
  align-items: flex-end;
  justify-content: center;
  margin-top: ${({ marginTop = '0px' }) => marginTop};
  margin-bottom: ${({ marginBottom = '0px' }) => marginBottom};
`

const Value = styled.Text<{
  fontSize?: number
  fontWeight?: FontWeightProperty
  color: string
}>`
  font-family: ${props => props.theme.fontWeight.regular};
  font-size: ${({ fontSize = 14 }) => fontSize + 'px'};
  font-weight: ${({ fontWeight = 'normal' }) => fontWeight};
  color: ${props => props.color};
`

const Meta = styled.Text<{
  fontSize?: number
  color: string
}>`
  font-family: ${props => props.theme.fontWeight.regular};
  font-size: ${({ fontSize = 10 }) => fontSize + 'px'};
  margin-left: 1px;
  color: ${props => props.color};
`