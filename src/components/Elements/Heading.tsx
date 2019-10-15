import React from 'react';
import styled from 'styled-components/native';
import { TextProps } from 'react-native';
import { TextAlignProperty } from 'csstype';
import { FlattenSimpleInterpolation } from 'styled-components';

interface HeadingProps extends TextProps {
  value: string
  children?: string
  size?: number
  align?: TextAlignProperty
  styles?: FlattenSimpleInterpolation
}

export const Heading = ({ value, children = value, ...props }: HeadingProps) => (
  <Container {...props}>
    {children}
  </Container>
);

const Container = styled.Text<{
  size?: number
  align?: TextAlignProperty
  styles?: FlattenSimpleInterpolation
}>`
  font-family: DMSans-Medium;
  font-size: ${props => props.size || props.theme.fontSize.regular};
  text-align: ${props => props.align || 'left'};
  ${props => props.styles};
`