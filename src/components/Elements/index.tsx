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
}
export const TextMeta = (props: TextMetaProps) => (
  <Container
    marginTop={props.marginTop}
    marginBottom={props.marginBottom}
  >
    <Value
      fontSize={props.valueFontSize}
      fontWeight={props.valueFontWeight}
    >
      {props.value}
    </Value>
    <Meta fontSize={props.metaFontSize}>
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
}>`
  font-family: 'DMSans-Regular';
  font-size: ${({ fontSize = 14 }) => fontSize + 'px'};
  font-weight: ${({ fontWeight = 'normal' }) => fontWeight};
`

const Meta = styled.Text<{
  fontSize?: number
}>`
  font-family: 'DMSans-Regular';
  font-size: ${({ fontSize = 10 }) => fontSize + 'px'};
  margin-left: 2px;
`