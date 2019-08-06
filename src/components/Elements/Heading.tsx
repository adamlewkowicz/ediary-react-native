import React from 'react';
import styled from 'styled-components/native';
import { TextProps } from 'react-native';
import { Theme } from '../../common/theme';
import { TextAlignProperty } from 'csstype';
import { FlattenSimpleInterpolation } from 'styled-components';

interface HeadingProps extends TextProps {
  value: string
  children?: string
  size?: number
  align?: TextAlignProperty
  css?: FlattenSimpleInterpolation
}
export const Heading = ({ value, children = value, ...props }: HeadingProps) => (
  <Container {...props}>
    {children}
  </Container>
);

const Container = styled.Text<{
  theme: Theme
  size?: number
  align?: TextAlignProperty
  css?: FlattenSimpleInterpolation
}>`
  font-family: DMSans-Medium;
  font-size: ${props => props.size || props.theme.fontSize}px;
  text-align: ${props => props.align || 'left'};
  ${props => props.css};
`